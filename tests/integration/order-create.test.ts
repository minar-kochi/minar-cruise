/**
 * Order creation — the half of the flow that runs BEFORE the customer pays.
 *
 * The public booking flow never writes a `Booking` row. `createRazorPayIntent`
 * only creates a Razorpay order and packs everything needed to reconstruct the
 * booking into that order's `notes`; the rows appear later, inside the
 * `order.paid` webhook. So what is worth asserting here is precisely the two
 * things that cross the boundary: the AMOUNT we ask Razorpay to charge, and the
 * NOTES that are the only description of the booking until the webhook lands.
 *
 * `orders.create` is mocked (tests/setup/mocks.ts) and records its argument.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import { addDaysToKey, formatDayKey, istToday } from "@/lib/datetime";
import { resetDb, type Baseline } from "../helpers/db";
import { key, makeSchedule, fillSeats } from "../helpers/factories";
import { bookingInput, caller } from "../helpers/trpc";
import { razorpayMock } from "../setup/mocks";

const RAZORPAY_MAX_NOTES = 15;

let base: Baseline;
// Far enough out to clear any lead time, and derived from the IST clock rather
// than a literal so the suite does not expire.
const SOON = addDaysToKey(istToday(), 30);

beforeEach(async () => {
  base = await resetDb();
  razorpayMock.reset();
});

describe("amount handed to Razorpay", () => {
  it("is GST-inclusive paise for the seats selected", async () => {
    await makeSchedule({
      day: SOON,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    await caller.user.createRazorPayIntent(
      bookingInput({
        packageId: base.pkg.id,
        selectedScheduleDate: SOON,
        numOfAdults: 2,
        numOfChildren: 1,
      }),
    );

    // 2 x ₹1000 + 1 x ₹500 = ₹2500 base, +5% GST = ₹2625 => 262500 paise.
    const opts = razorpayMock.lastOrderOptions()!;
    expect(opts.amount).toBe(262_500);
    expect(opts.currency).toBe("INR");
    expect(opts.payment_capture).toBe(1);
  });

  it("charges nothing for babies", async () => {
    await makeSchedule({
      day: SOON,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    await caller.user.createRazorPayIntent(
      bookingInput({
        packageId: base.pkg.id,
        selectedScheduleDate: SOON,
        numOfAdults: 1,
        numOfChildren: 0,
        numOfBaby: 3,
      }),
    );

    expect(razorpayMock.lastOrderOptions()!.amount).toBe(105_000); // ₹1000 + 5%
  });
});

describe("notes — the contract with the webhook", () => {
  it("stays within Razorpay's 15-key cap and carries no undefined", async () => {
    const schedule = await makeSchedule({
      day: SOON,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    await caller.user.createRazorPayIntent(
      bookingInput({ packageId: base.pkg.id, selectedScheduleDate: SOON }),
    );

    const notes = razorpayMock.lastOrderOptions()!.notes as Record<string, unknown>;

    expect(Object.keys(notes).length).toBeLessThanOrEqual(RAZORPAY_MAX_NOTES);
    expect(Object.entries(notes).filter(([, v]) => v === undefined)).toEqual([]);
    expect(notes.eventType).toBe("schedule.existing");
    expect(notes.scheduleId).toBe(schedule.id);
    expect(notes.packageId).toBe(base.pkg.id);

    /**
     * `scheduledDate` is dd-MM-yyyy here, NOT the yyyy-MM-dd day key.
     *
     * The two producers disagree: this procedure writes
     * `formatDayKey(..., "date")`, while handle-order.ts writes the raw day key
     * when it rewrites schedule.create into schedule.existing. Pinned rather
     * than "corrected" because it is audit-only — resolution uses `scheduleId`,
     * nothing reads this back — so changing it is a decision, not a cleanup.
     */
    expect(notes.scheduledDate).toBe(formatDayKey(SOON, "date"));
    expect(notes.scheduledDate).not.toBe(SOON);
  });

  it("carries a booking id that does not exist as a row yet", async () => {
    await makeSchedule({
      day: SOON,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    await caller.user.createRazorPayIntent(
      bookingInput({ packageId: base.pkg.id, selectedScheduleDate: SOON }),
    );

    const notes = razorpayMock.lastOrderOptions()!.notes as Record<string, string>;

    // The id is generated client-side at order time and becomes the explicit
    // `Booking.id` in the webhook. That is what makes a duplicate delivery
    // collide on the primary key instead of double-booking — see
    // webhook-idempotency.test.ts.
    expect(notes.bookingId).toMatch(/^[a-z0-9]+$/i);
    expect(await db.booking.findUnique({ where: { id: notes.bookingId } })).toBeNull();
  });

  it("uses schedule.create when the date has no schedule", async () => {
    // No makeSchedule call: the date is empty, so the webhook will have to
    // create the Schedule row as well as the Booking.
    await caller.user.createRazorPayIntent(
      bookingInput({ packageId: base.pkg.id, selectedScheduleDate: SOON }),
    );

    const notes = razorpayMock.lastOrderOptions()!.notes as Record<string, unknown>;
    expect(notes.eventType).toBe("schedule.create");
    expect(notes.date).toBe(SOON);
    expect(notes.scheduleId).toBeUndefined();
    expect(await db.schedule.count()).toBe(0);
  });
});

describe("nothing is written before payment", () => {
  it("creates no Booking, Payments or Schedule row", async () => {
    await makeSchedule({
      day: SOON,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    await caller.user.createRazorPayIntent(
      bookingInput({ packageId: base.pkg.id, selectedScheduleDate: SOON }),
    );

    expect(await db.booking.count()).toBe(0);
    expect(await db.payments.count()).toBe(0);
    expect(await db.schedule.count()).toBe(1); // the one the fixture made

    // A `User` row IS written, though — before payment, on every attempt, with
    // no uniqueness on email. Asserted so the behaviour is at least recorded.
    expect(await db.user.count()).toBe(1);
  });
});

describe("capacity", () => {
  it("refuses a party larger than the seats left", async () => {
    const schedule = await makeSchedule({
      day: SOON,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });
    await fillSeats(schedule.id, 148); // 150-seat boat, 2 left

    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({
          packageId: base.pkg.id,
          selectedScheduleDate: SOON,
          numOfAdults: 5,
        }),
      ),
    ).rejects.toThrow();

    expect(razorpayMock.callCount()).toBe(0);
  });

  it("allows a party that exactly fills the boat", async () => {
    const schedule = await makeSchedule({
      day: SOON,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });
    await fillSeats(schedule.id, 148);

    await caller.user.createRazorPayIntent(
      bookingInput({
        packageId: base.pkg.id,
        selectedScheduleDate: SOON,
        numOfAdults: 2,
      }),
    );

    expect(razorpayMock.callCount()).toBe(1);
  });

  /**
   * KNOWN BUG, asserted as-is so a fix is a deliberate change rather than a
   * surprise. userBookingExistingScheduleTRPC.ts builds the "almost full"
   * message from `exceededSeatCount` — the OVERFLOW — not from `remainingSeats`.
   * With 2 seats left and a party of 5 the customer is told "we only have 3
   * seats left", which is both wrong and larger than the truth.
   */
  it("reports the overflow instead of the seats remaining (known bug)", async () => {
    const schedule = await makeSchedule({
      day: SOON,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });
    await fillSeats(schedule.id, 148); // 2 seats remain

    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({
          packageId: base.pkg.id,
          selectedScheduleDate: SOON,
          numOfAdults: 5, // overflow = 5 - 2 = 3
        }),
      ),
    ).rejects.toThrow("Booking is almost full, We only have 3 seats left");
  });

  it("says 'Booking is full' when there are no seats at all", async () => {
    const schedule = await makeSchedule({
      day: SOON,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });
    await fillSeats(schedule.id, 150);

    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({ packageId: base.pkg.id, selectedScheduleDate: SOON, numOfAdults: 1 }),
      ),
    ).rejects.toThrow("Booking is full");
  });
});

describe("gates before an order is created", () => {
  it("refuses an enquiry-only package", async () => {
    await db.package.update({
      where: { id: base.pkg.id },
      data: { isBookableOnline: false },
    });
    await makeSchedule({
      day: SOON,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({ packageId: base.pkg.id, selectedScheduleDate: SOON }),
      ),
    ).rejects.toThrow(/enquiry only/i);
    expect(razorpayMock.callCount()).toBe(0);
  });

  it("refuses a BLOCKED schedule", async () => {
    await makeSchedule({
      day: SOON,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
      scheduleStatus: "BLOCKED",
    });

    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({ packageId: base.pkg.id, selectedScheduleDate: SOON }),
      ),
    ).rejects.toThrow();
    expect(razorpayMock.callCount()).toBe(0);
  });

  it("refuses a party of zero billable seats", async () => {
    await makeSchedule({
      day: SOON,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({
          packageId: base.pkg.id,
          selectedScheduleDate: SOON,
          numOfAdults: 0,
          numOfChildren: 0,
          numOfBaby: 2,
        }),
      ),
    ).rejects.toThrow();
    expect(razorpayMock.callCount()).toBe(0);
  });

  it("refuses an unknown package", async () => {
    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({ packageId: "pk_does_not_exist", selectedScheduleDate: SOON }),
      ),
    ).rejects.toThrow();
    expect(razorpayMock.callCount()).toBe(0);
  });

  it("refuses a malformed date", async () => {
    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({ packageId: base.pkg.id, selectedScheduleDate: "16/08/2026" }),
      ),
    ).rejects.toThrow();
    expect(razorpayMock.callCount()).toBe(0);
  });
});

describe("the schedule/date mismatch guard", () => {
  /**
   * Customers have previously been charged for a schedule days away from the one
   * they picked. `schedule.id` is what gets frozen into the notes and nothing
   * downstream re-checks the date, so this comparison is the last place it can
   * be caught while the customer can still be told.
   */
  it("does not resolve one date's booking onto another date's schedule", async () => {
    const other = addDaysToKey(SOON, 1);
    await makeSchedule({
      day: other,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    // SOON itself has no schedule, so this must open a new one for SOON rather
    // than reach for the neighbouring day's row.
    await caller.user.createRazorPayIntent(
      bookingInput({ packageId: base.pkg.id, selectedScheduleDate: SOON }),
    );

    const notes = razorpayMock.lastOrderOptions()!.notes as Record<string, unknown>;
    expect(notes.eventType).toBe("schedule.create");
    expect(notes.date).toBe(SOON);
  });
});

describe("day-boundary bookings", () => {
  /**
   * A 00:30 IST departure is 19:00Z on the PREVIOUS UTC day. Everything from the
   * resolver to the CHECK constraint has to agree that the sailing belongs to
   * the IST day the customer picked.
   */
  it("prices and resolves a just-after-IST-midnight sailing", async () => {
    const midnightPkg = await db.package.update({
      where: { id: base.pkg.id },
      data: { startMinutesIst: 30, duration: 120 }, // 00:30 -> 02:30 IST
    });

    const schedule = await makeSchedule({
      day: SOON,
      packageId: midnightPkg.id,
      packageStartMinutesIst: midnightPkg.startMinutesIst,
      packageDurationMinutes: midnightPkg.duration,
    });

    // The instant is on the previous UTC day...
    expect(schedule.startsAt!.toISOString()).toContain(
      addDaysToKey(key(SOON), -1),
    );

    await caller.user.createRazorPayIntent(
      bookingInput({ packageId: midnightPkg.id, selectedScheduleDate: SOON }),
    );

    // ...but the booking is still for the IST day the customer chose.
    const notes = razorpayMock.lastOrderOptions()!.notes as Record<string, unknown>;
    expect(notes.eventType).toBe("schedule.existing");
    expect(notes.scheduledDate).toBe(formatDayKey(SOON, "date"));
    expect(notes.scheduleId).toBe(schedule.id);
  });
});
