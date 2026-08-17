/**
 * Razorpay caps order `notes` at 15 key/value pairs, and the booking-link id has
 * to survive handle-order.ts's `schedule.create -> schedule.existing` rewrite.
 * Both are easy to break silently. Ported from scripts/assert-razorpay-notes.ts.
 *
 * `notes` is the entire contract between order creation and the webhook: it is
 * where a booking lives between the customer paying and the row existing. A
 * dropped key here is a booking that cannot be reconstructed after the money has
 * already been taken.
 */
import { describe, expect, it } from "vitest";
import { getNotes } from "@/lib/razorpay/getNotes";
import type {
  TRazorPayEventsCreateSchedule,
  TRazorPayEventsExistingSchedule,
} from "@/Types/razorpay/type";

const RAZORPAY_MAX_NOTES = 15;

const booking = {
  bookingId: "bk_1",
  userId: "u_1",
  name: "Test Customer",
  email: "test@example.com",
  adultCount: 2,
  childCount: 1,
  babyCount: 0,
};

const publicExisting = getNotes({
  eventType: "schedule.existing",
  packageId: "pk_1",
  scheduleId: "sc_1",
  packageTitle: "Sunset Dinner Cruise",
  scheduledDate: "22-05-2026",
  ...booking,
});

const publicCreate = getNotes({
  eventType: "schedule.create",
  packageId: "pk_1",
  date: "2026-05-22",
  ScheduleTime: "DINNER",
  packageTitle: "Sunset Dinner Cruise",
  ...booking,
});

const linkExisting = getNotes({
  eventType: "schedule.existing",
  packageId: "pk_1",
  scheduleId: "sc_1",
  packageTitle: "Sunset Dinner Cruise",
  scheduledDate: "22-05-2026",
  bookingLinkId: "bl_1",
  ...booking,
}) as TRazorPayEventsExistingSchedule;

const linkCreate = getNotes({
  eventType: "schedule.create",
  packageId: "pk_1",
  date: "2026-05-22",
  ScheduleTime: "DINNER",
  packageTitle: "Sunset Dinner Cruise",
  bookingLinkId: "bl_1",
  ...booking,
}) as TRazorPayEventsCreateSchedule;

// The high-risk path: a link was issued for a date with no schedule, someone
// created that schedule before the customer paid, and handle-order.ts rewrites
// the notes. This replicates that transform exactly.
const { ScheduleTime, packageId, date, eventType, ...rest } = linkCreate;
const rewritten = getNotes({
  eventType: "schedule.existing",
  scheduleId: "sc_created_later",
  packageId,
  scheduledDate: date,
  ...rest,
}) as TRazorPayEventsExistingSchedule;

describe("Public flow (no booking link) must be unchanged", () => {
  it("schedule.existing has no bookingLinkId key", () =>
    expect("bookingLinkId" in publicExisting).toBe(false));
  it(`schedule.existing within the ${RAZORPAY_MAX_NOTES}-key cap`, () =>
    expect(Object.keys(publicExisting).length).toBeLessThanOrEqual(RAZORPAY_MAX_NOTES));
  it("schedule.create has no bookingLinkId key", () =>
    expect("bookingLinkId" in publicCreate).toBe(false));
});

describe("Booking-link flow carries the id and stays within the cap", () => {
  it("schedule.existing carries bookingLinkId", () =>
    expect(linkExisting.bookingLinkId).toBe("bl_1"));
  it(`schedule.existing within the ${RAZORPAY_MAX_NOTES}-key cap`, () =>
    expect(Object.keys(linkExisting).length).toBeLessThanOrEqual(RAZORPAY_MAX_NOTES));
  it("schedule.create carries bookingLinkId", () =>
    expect(linkCreate.bookingLinkId).toBe("bl_1"));
  it(`schedule.create within the ${RAZORPAY_MAX_NOTES}-key cap`, () =>
    expect(Object.keys(linkCreate).length).toBeLessThanOrEqual(RAZORPAY_MAX_NOTES));
});

describe("handle-order.ts schedule.create -> schedule.existing rewrite", () => {
  it("bookingLinkId survives the ...rest re-spread", () =>
    expect(rewritten.bookingLinkId).toBe("bl_1"));
  it("rewritten notes keep the booking id", () => expect(rewritten.bookingId).toBe("bk_1"));
  it("rewritten notes keep the guest counts", () => expect(rewritten.adultCount).toBe(2));
  it(`rewritten notes within the ${RAZORPAY_MAX_NOTES}-key cap`, () =>
    expect(Object.keys(rewritten).length).toBeLessThanOrEqual(RAZORPAY_MAX_NOTES));
});

describe("No undefined values in any shape", () => {
  // Razorpay drops/rejects undefined values; make sure we never emit one.
  const SHAPES = [
    ["public existing", publicExisting],
    ["public create", publicCreate],
    ["link existing", linkExisting],
    ["link create", linkCreate],
    ["rewritten", rewritten],
  ] as const;

  it.each(SHAPES)("%s has no undefined values", (_label, notes) => {
    const undef = Object.entries(notes)
      .filter(([, v]) => v === undefined)
      .map(([k]) => k);
    expect(undef).toEqual([]);
  });
});
