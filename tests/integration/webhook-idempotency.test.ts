/**
 * Webhook idempotency — the state machine in
 * src/app/api/webhook/v2/razorpay/existing-event.ts.
 *
 * Razorpay retries a delivery until it gets a 2xx, and it can also deliver the
 * same event more than once on its own. The `Events` table keyed by
 * `x-razorpay-event-id` is what stops that becoming two bookings for one
 * payment, so every branch of it is worth pinning down.
 *
 * The "stuck event" branches are driven by writing a real past timestamp into
 * `lastProcessingAttempt` rather than by faking the clock — `isOlderThan` reads
 * `new Date()` deep inside the request, and moving the database's data is both
 * closer to what actually happens and safe around Prisma's own timers.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import { addDaysToKey, istToday } from "@/lib/datetime";
import { MAX_EVENT_RETRY_WEBHOOK_COUNT } from "@/constants/config";
import { resetDb, type Baseline } from "../helpers/db";
import { makeSchedule } from "../helpers/factories";
import { payFor, redeliver } from "../helpers/flow";
import { bookingInput, caller } from "../helpers/trpc";
import { postWebhook } from "../helpers/webhook";
import { newEventId, orderPaidEvent } from "../fixtures/razorpay";
import { mailMock, razorpayMock } from "../setup/mocks";

let base: Baseline;
const DAY = addDaysToKey(istToday(), 30);

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000);

beforeEach(async () => {
  base = await resetDb();
  razorpayMock.reset();
  mailMock.reset();
  await makeSchedule({
    day: DAY,
    packageId: base.pkg.id,
    packageStartMinutesIst: base.pkg.startMinutesIst,
    packageDurationMinutes: base.pkg.duration,
  });
});

/** Creates an order for DAY without delivering a webhook. */
function orderOnly() {
  return caller.user.createRazorPayIntent(
    bookingInput({ packageId: base.pkg.id, selectedScheduleDate: DAY }),
  );
}

describe("a repeated delivery of a completed event", () => {
  it("returns 200 and creates exactly one booking", async () => {
    const flow = await payFor({ packageId: base.pkg.id, selectedScheduleDate: DAY });
    expect(await db.booking.count()).toBe(1);

    const again = await redeliver(flow);

    expect(again.status).toBe(200);
    expect(again.body.success).toBe(true);
    expect(await db.booking.count()).toBe(1);
    expect(await db.payments.count()).toBe(1);
  });

  it("stays at one booking however many times it is redelivered", async () => {
    const flow = await payFor({ packageId: base.pkg.id, selectedScheduleDate: DAY });

    for (let i = 0; i < 5; i++) {
      const res = await redeliver(flow);
      expect(res.status).toBe(200);
    }

    expect(await db.booking.count()).toBe(1);
    const events = await db.events.findMany({ where: { eventId: flow.eventId } });
    expect(events).toHaveLength(1);
    expect(events[0].status).toBe("SUCCESS");
  });
});

describe("a delivery arriving while the first is still in flight", () => {
  it("returns 202 and writes nothing", async () => {
    const eventId = newEventId();
    // A row the first delivery would have written moments ago.
    await db.events.create({
      data: {
        eventId,
        status: "PROCESSING",
        FailedCount: 0,
        description: "Processing Booking information",
        lastProcessingAttempt: minutesAgo(1),
      },
    });

    const res = await postWebhook(orderPaidEvent({ notes: { eventType: "noop" } }), {
      eventId,
    });

    // 202 Accepted: "I have this, it is in progress, do not send it again yet."
    expect(res.status).toBe(202);
    expect(await db.booking.count()).toBe(0);
  });

  it("retries once the in-flight attempt is older than four minutes", async () => {
    const eventId = newEventId();
    await db.events.create({
      data: {
        eventId,
        status: "PROCESSING",
        FailedCount: 0,
        description: "Processing Booking information",
        // Past FOUR_MINUTE: the first attempt died without finishing, so the
        // work is safe to pick up again.
        lastProcessingAttempt: minutesAgo(5),
      },
    });

    await orderOnly();
    const order = razorpayMock.lastOrderOptions()!;
    const res = await postWebhook(
      orderPaidEvent({ notes: order.notes, amountPaid: order.amount }),
      { eventId },
    );

    expect(res.status).toBe(200);
    expect(await db.booking.count()).toBe(1);
  });

  it("the four-minute boundary is what decides between 202 and a retry", async () => {
    const stuck = newEventId();
    await db.events.create({
      data: {
        eventId: stuck,
        status: "PROCESSING",
        FailedCount: 0,
        lastProcessingAttempt: minutesAgo(3),
      },
    });
    const fresh = await postWebhook(orderPaidEvent({ notes: { eventType: "noop" } }), {
      eventId: stuck,
    });
    expect(fresh.status).toBe(202);

    await db.events.updateMany({
      where: { eventId: stuck },
      data: { lastProcessingAttempt: minutesAgo(5) },
    });
    const stale = await postWebhook(orderPaidEvent({ notes: { eventType: "noop" } }), {
      eventId: stuck,
    });
    // Now it is picked up again — and the unknown notes shape sends it down the
    // UNKNOWN_NOTES_EVENT path rather than leaving it parked at 202.
    expect(stale.status).not.toBe(202);
  });
});

describe("a repeatedly failing event", () => {
  it("is retried while its failure count is under the ceiling", async () => {
    const eventId = newEventId();
    await db.events.create({
      data: {
        eventId,
        status: "FAILED",
        FailedCount: 1,
        lastProcessingAttempt: minutesAgo(10),
      },
    });

    await orderOnly();
    const order = razorpayMock.lastOrderOptions()!;
    const res = await postWebhook(
      orderPaidEvent({ notes: order.notes, amountPaid: order.amount }),
      { eventId },
    );

    expect(res.status).toBe(200);
    expect(await db.booking.count()).toBe(1);

    const row = await db.events.findFirstOrThrow({ where: { eventId } });
    expect(row.FailedCount).toBe(2); // incremented on the way into the retry
  });

  it("gives up and alerts a human once the ceiling is reached", async () => {
    const eventId = newEventId();
    await db.events.create({
      data: {
        eventId,
        status: "FAILED",
        FailedCount: MAX_EVENT_RETRY_WEBHOOK_COUNT,
        lastProcessingAttempt: minutesAgo(10),
      },
    });

    const res = await postWebhook(orderPaidEvent({ notes: { eventType: "noop" } }), {
      eventId,
    });

    // 200 so Razorpay stops retrying; a person now has to deal with it, because
    // the customer's money has already been taken.
    expect(res.status).toBe(200);
    expect(await db.booking.count()).toBe(0);
    expect(mailMock.subjects().join(" ")).toMatch(/Unprocessable Event/i);
  });
});

describe("two deliveries of the same event racing each other", () => {
  /**
   * KNOWN GAP, pinned rather than papered over.
   *
   * `Events.eventId` is `@@index`ed but NOT `@unique` (prisma/schema.prisma).
   * Both deliveries can therefore `findFirst` -> null and both create their own
   * PROCESSING row, so the Events table is not actually the thing preventing a
   * double booking.
   *
   * What saves it is that `Booking.id` is the cuid generated at ORDER time and
   * carried in the notes, so the second transaction collides on the primary key.
   * That is a real guarantee, but it is a second line of defence doing the first
   * line's job — and P2002 is deliberately not in `isRetryableError`, so it
   * surfaces as a failed delivery rather than a silent duplicate.
   */
  it("still produces one booking, saved by the Booking primary key", async () => {
    await orderOnly();
    const order = razorpayMock.lastOrderOptions()!;
    const event = orderPaidEvent({ notes: order.notes, amountPaid: order.amount });

    // Two distinct ids, same underlying order: the idempotency key does not
    // help at all here, which is precisely the point.
    const [a, b] = await Promise.all([
      postWebhook(event, { eventId: newEventId() }),
      postWebhook(event, { eventId: newEventId() }),
    ]);

    expect(await db.booking.count()).toBe(1);
    expect(await db.payments.count()).toBe(1);
    // One succeeded, one did not.
    expect([a.body.success, b.body.success].filter(Boolean)).toHaveLength(1);
  });

  it("records duplicate Events rows for one idempotency key", async () => {
    const eventId = newEventId();
    await orderOnly();
    const order = razorpayMock.lastOrderOptions()!;
    const event = orderPaidEvent({ notes: order.notes, amountPaid: order.amount });

    await Promise.all([
      postWebhook(event, { eventId }),
      postWebhook(event, { eventId }),
    ]);

    const rows = await db.events.findMany({ where: { eventId } });
    // Two rows for one Razorpay event id. A @unique on Events.eventId would
    // make this 1 and turn the race into a clean SUCCESS/duplicate outcome.
    expect(rows.length).toBeGreaterThan(1);
    expect(await db.booking.count()).toBe(1);
  });
});

describe("an event type the route does not handle", () => {
  it("leaves a PROCESSING row that nothing will ever resolve", async () => {
    // The Events row is created BEFORE `body.event` is inspected, and only
    // "order.paid" is dispatched. Any other subscribed event therefore parks a
    // row at PROCESSING for good. Pinned so the leak is visible.
    const eventId = newEventId();
    const event = {
      ...orderPaidEvent({ notes: { eventType: "schedule.existing" } }),
      event: "payment.failed",
    };

    const res = await postWebhook(event, { eventId });

    expect(res.status).toBe(200);
    const row = await db.events.findFirstOrThrow({ where: { eventId } });
    expect(row.status).toBe("PROCESSING");
    expect(await db.booking.count()).toBe(0);
  });
});

