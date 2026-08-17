/**
 * The `order.paid` webhook, end to end.
 *
 * This is where a booking actually comes into existence: an order is created,
 * the customer pays, Razorpay POSTs here, and only then do `Booking`, `Payments`
 * and (on the create path) `Schedule` rows appear. Every test drives the real
 * exported `POST` with a genuinely HMAC-signed body, so signature verification,
 * the idempotency state machine and the handlers are all live.
 *
 * Signature note worth carrying: `lib/helpers/signature.ts` HMACs
 * `JSON.stringify(parsedBody)`, not the raw request bytes. tests/helpers/webhook.ts
 * matches that exactly. It also means any proxy that reorders keys or re-indents
 * the body in transit would break verification in production.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import {
  addDaysToKey,
  dayKeyOfDateColumn,
  istDayKeyOf,
  istMinutesOfInstant,
  istToday,
} from "@/lib/datetime";
import { resetDb, type Baseline } from "../helpers/db";
import { makeSchedule } from "../helpers/factories";
import { payFor } from "../helpers/flow";
import { bookingInput, caller } from "../helpers/trpc";
import { postWebhook, signBody } from "../helpers/webhook";
import { newEventId, orderPaidEvent } from "../fixtures/razorpay";
import { mailMock, razorpayMock } from "../setup/mocks";

let base: Baseline;
const DAY = addDaysToKey(istToday(), 30);

beforeEach(async () => {
  base = await resetDb();
  razorpayMock.reset();
  mailMock.reset();
});

/** Creates an order for DAY without delivering a webhook. */
function orderOnly(overrides: { numOfAdults?: number; numOfChildren?: number } = {}) {
  return caller.user.createRazorPayIntent(
    bookingInput({ packageId: base.pkg.id, selectedScheduleDate: DAY, ...overrides }),
  );
}

describe("signature verification", () => {
  it("accepts a correctly signed body", async () => {
    await makeSchedule({
      day: DAY,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    const flow = await payFor({ packageId: base.pkg.id, selectedScheduleDate: DAY });

    expect(flow.result.status).toBe(200);
    expect(flow.result.body.success).toBe(true);
    expect(await db.booking.count()).toBe(1);
  });

  it("rejects a tampered signature and writes nothing", async () => {
    await makeSchedule({
      day: DAY,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    await orderOnly();
    const event = orderPaidEvent({
      notes: razorpayMock.lastOrderOptions()!.notes,
      amountPaid: razorpayMock.lastOrderOptions()!.amount,
    });

    const res = await postWebhook(event, {
      eventId: newEventId(),
      signature: "deadbeef".repeat(8),
    });

    // 200, NOT 401 — deliberate. Razorpay retries on any non-2xx, and a bad
    // signature will never become a good one, so the route ends the delivery
    // rather than inviting an infinite retry loop. Asserting 401 here would be
    // asserting a bug.
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(await db.booking.count()).toBe(0);
    expect(await db.events.count()).toBe(0);
  });

  it("rejects a body signed with the wrong secret", async () => {
    const event = orderPaidEvent({ notes: { eventType: "schedule.existing" } });
    const res = await postWebhook(event, {
      eventId: newEventId(),
      signature: signBody(event, "not_the_webhook_secret"),
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(await db.events.count()).toBe(0);
  });

  it("rejects a body mutated after signing", async () => {
    const event = orderPaidEvent({ notes: { eventType: "schedule.existing" } });
    const signature = signBody(event);
    // Someone raises the amount in flight; the signature no longer matches.
    event.payload.order.entity.amount_paid = 1;

    const res = await postWebhook(event, { eventId: newEventId(), signature });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(await db.events.count()).toBe(0);
  });

  it("refuses a request with no signature header", async () => {
    const event = orderPaidEvent({ notes: {} });
    const res = await postWebhook(event, { eventId: newEventId(), omitSignature: true });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(await db.events.count()).toBe(0);
  });

  it("refuses a request with no event id header", async () => {
    const event = orderPaidEvent({ notes: {} });
    const res = await postWebhook(event, { eventId: "unused", omitEventId: true });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(false);
    expect(await db.events.count()).toBe(0);
  });
});

describe("schedule.existing — booking onto a schedule that already exists", () => {
  it("writes Booking, Payments, User and marks the Event SUCCESS", async () => {
    const schedule = await makeSchedule({
      day: DAY,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    const flow = await payFor({
      packageId: base.pkg.id,
      selectedScheduleDate: DAY,
      numOfAdults: 2,
      numOfChildren: 1,
      numOfBaby: 1,
    });

    const booking = await db.booking.findUniqueOrThrow({
      where: { id: flow.bookingId },
      include: { payment: true, user: true, schedule: true },
    });

    // The id came from the notes, not from a database default — that is what
    // makes a duplicate delivery collide instead of double-booking.
    expect(booking.id).toBe(flow.notes.bookingId);
    expect(booking.scheduleId).toBe(schedule.id);
    expect(booking.numOfAdults).toBe(2);
    expect(booking.numOfChildren).toBe(1);
    expect(booking.numOfBaby).toBe(1);
    expect(booking.totalBooking).toBe(4); // the $extends computed field

    expect(booking.user.email).toBe("customer@test.invalid");
    expect(booking.payment).not.toBeNull();

    const event = await db.events.findFirstOrThrow({ where: { eventId: flow.eventId } });
    expect(event.status).toBe("SUCCESS");
    expect(event.bookingId).toBe(booking.id);
  });

  it("stores money as whole rupees, GST-consistent with the paise charged", async () => {
    await makeSchedule({
      day: DAY,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    // 2 adults @ ₹1000 + 1 child @ ₹500 = ₹2500 base, +5% = ₹2625.
    const flow = await payFor({
      packageId: base.pkg.id,
      selectedScheduleDate: DAY,
      numOfAdults: 2,
      numOfChildren: 1,
    });
    expect(flow.amount).toBe(262_500);

    const booking = await db.booking.findUniqueOrThrow({
      where: { id: flow.bookingId },
      include: { payment: true },
    });
    const p = booking.payment;

    // Payments columns are Int RUPEES, while Razorpay deals in paise.
    expect(p.totalAmount).toBe(2625);
    expect(Number.isInteger(p.totalAmount)).toBe(true);
    expect(Number.isInteger(p.baseAmount)).toBe(true);
    expect(Number.isInteger(p.gstAmount)).toBe(true);
    expect(p.baseAmount + p.gstAmount).toBe(p.totalAmount);
    expect(p.gstRate).toBe(5);
    // Public flow: the whole amount is captured up front, nothing is "advance".
    expect(p.advancePaid).toBe(0);
  });
});

describe("schedule.create — the webhook opens the sailing too", () => {
  it("creates the Schedule with instants derived by the production rule", async () => {
    // No schedule for DAY, so the order is schedule.create.
    const flow = await payFor({ packageId: base.pkg.id, selectedScheduleDate: DAY });

    expect(flow.notes.eventType).toBe("schedule.create");
    expect(flow.result.status).toBe(200);

    const schedule = await db.schedule.findFirstOrThrow();
    expect(dayKeyOfDateColumn(schedule.day)).toBe(DAY);
    expect(schedule.scheduleStatus).toBe("AVAILABLE");
    expect(schedule.packageId).toBe(base.pkg.id);

    // A paid sailing must never be left without an instant: a NULL startsAt
    // hides it from every instant-based query while a customer holds a ticket.
    expect(schedule.startsAt).not.toBeNull();
    expect(schedule.endsAt).not.toBeNull();
    expect(istMinutesOfInstant(schedule.startsAt!)).toBe(base.pkg.startMinutesIst);

    // The invariant Schedule_day_matches_startsAt enforces, verified through a
    // real round trip rather than in the abstract.
    expect(istDayKeyOf(schedule.startsAt!)).toBe(dayKeyOfDateColumn(schedule.day));

    const booking = await db.booking.findUniqueOrThrow({ where: { id: flow.bookingId } });
    expect(booking.scheduleId).toBe(schedule.id);
  });

  it("does not leave a Schedule behind when the booking fails", async () => {
    // Point the notes at a package that no longer exists; the transaction that
    // creates the Schedule and the Booking must roll back as a unit.
    await orderOnly();
    const notes = {
      ...(razorpayMock.lastOrderOptions()!.notes as Record<string, unknown>),
      packageId: "pk_deleted",
    };
    const event = orderPaidEvent({ notes, amountPaid: 100_000 });
    await postWebhook(event, { eventId: newEventId() });

    expect(await db.booking.count()).toBe(0);
    expect(await db.schedule.count()).toBe(0);
  });
});

describe("the schedule.create -> schedule.existing rewrite", () => {
  /**
   * The race the rewrite exists for: a customer orders for a date with no
   * schedule, an admin creates that schedule while the customer is paying, and
   * the webhook arrives to find the slot already taken. handle-order.ts rewrites
   * the notes rather than failing, and the rewrite must not drop anything.
   */
  it("books onto the schedule created in the gap instead of failing", async () => {
    // Order first, while the date is still empty.
    await orderOnly();
    const order = razorpayMock.lastOrderOptions()!;
    expect((order.notes as Record<string, unknown>).eventType).toBe("schedule.create");

    // The schedule appears before the webhook lands.
    const schedule = await makeSchedule({
      day: DAY,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    const event = orderPaidEvent({ notes: order.notes, amountPaid: order.amount });
    const res = await postWebhook(event, { eventId: newEventId() });

    expect(res.status).toBe(200);
    expect(await db.schedule.count()).toBe(1); // no duplicate slot

    const booking = await db.booking.findFirstOrThrow();
    expect(booking.scheduleId).toBe(schedule.id);
  });

  it("refuses when the existing schedule belongs to a different package", async () => {
    await orderOnly();
    const order = razorpayMock.lastOrderOptions()!;

    // Someone else's package now owns that slot.
    const otherAmenities = await db.amenities.create({ data: {} });
    const otherFood = await db.foodMenu.create({ data: { name: "Other" } });
    const otherPkg = await db.package.create({
      data: {
        title: "Other Cruise",
        packageType: "Cruise",
        description: "Different package on the same slot.",
        adultPrice: 100_000,
        childPrice: 50_000,
        duration: 240,
        startMinutesIst: 540,
        slug: "other-cruise",
        packageCategory: "BREAKFAST",
        amenitiesId: otherAmenities.id,
        foodMenuId: otherFood.id,
      },
    });
    await makeSchedule({
      day: DAY,
      packageId: otherPkg.id,
      packageStartMinutesIst: otherPkg.startMinutesIst,
      packageDurationMinutes: otherPkg.duration,
    });

    const event = orderPaidEvent({ notes: order.notes, amountPaid: order.amount });
    const res = await postWebhook(event, { eventId: newEventId() });

    expect(res.body.success).toBe(false);
    expect(await db.booking.count()).toBe(0);
    // A conflict a human has to resolve — the customer has already paid.
    expect(mailMock.callCount()).toBeGreaterThan(0);
  });
});

describe("capacity is NOT re-checked at payment time (known gap)", () => {
  /**
   * Seats are counted when the ORDER is created; the webhook writes the booking
   * unconditionally. Two customers can pass the check on the last seats
   * independently and both be charged, and there is no hold or reservation row
   * in between. Asserted so the exposure is visible rather than assumed absent.
   */
  it("writes a booking that takes the schedule past maxBoatSeat", async () => {
    await db.bookingConfig.update({
      where: { id: "singleton" },
      data: { maxBoatSeat: 2 },
    });
    await makeSchedule({
      day: DAY,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    // Both customers order while there is room for two.
    await orderOnly({ numOfAdults: 2 });
    const first = razorpayMock.lastOrderOptions()!;
    await orderOnly({ numOfAdults: 2 });
    const second = razorpayMock.lastOrderOptions()!;

    await postWebhook(orderPaidEvent({ notes: first.notes, amountPaid: first.amount }), {
      eventId: newEventId(),
    });
    await postWebhook(orderPaidEvent({ notes: second.notes, amountPaid: second.amount }), {
      eventId: newEventId(),
    });

    const bookings = await db.booking.findMany();
    const seats = bookings.reduce((n, b) => n + b.totalBooking, 0);

    expect(bookings).toHaveLength(2);
    expect(seats).toBe(4); // on a 2-seat boat
  });
});

