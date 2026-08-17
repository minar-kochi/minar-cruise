/**
 * Timing x booking: when does a sailing stop being bookable?
 *
 * `isWithinBookingWindow` itself is covered as a pure function in
 * tests/unit/datetime.test.ts. What this file tests is whether the *server paths
 * that take money* actually consult it — which, as the last describe block
 * records, is not true of all of them.
 *
 * Clock control uses `toFake: ["Date"]` only. Faking timers wholesale would also
 * capture the `setTimeout` Prisma uses for connection and transaction timeouts,
 * and the suite would hang instead of failing.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { db } from "@/db";
import {
  addDaysToKey,
  getBookingWindow,
  istInstant,
  istToday,
  isWithinBookingWindow,
} from "@/lib/datetime";
import { resetDb, type Baseline } from "../helpers/db";
import { makeSchedule } from "../helpers/factories";
import { bookingInput, caller } from "../helpers/trpc";
import { razorpayMock } from "../setup/mocks";

let base: Baseline;

const DAY = addDaysToKey(istToday(), 30);
const DEPART_MINUTES = 540; // 09:00 IST
const departsAt = istInstant(DAY, DEPART_MINUTES);

const hoursBefore = (h: number) => new Date(departsAt.getTime() - h * 3_600_000);

beforeEach(async () => {
  base = await resetDb({ startMinutesIst: DEPART_MINUTES, minLeadTimeHours: 2 });
  razorpayMock.reset();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("the window boundary is exact", () => {
  it("is closed AT closesAt and open one millisecond earlier", () => {
    const { closesAt } = getBookingWindow({ departsAt, minLeadTimeHours: 2 });

    // The comparison in isWithinBookingWindow is a strict `>`, so the instant
    // the window closes is already too late.
    expect(isWithinBookingWindow({ departsAt, minLeadTimeHours: 2, now: closesAt })).toBe(
      false,
    );
    expect(
      isWithinBookingWindow({
        departsAt,
        minLeadTimeHours: 2,
        now: new Date(closesAt.getTime() - 1),
      }),
    ).toBe(true);
  });

  it.each([
    [0.5, 30],
    [1.25, 75],
    [0.1, 6],
    [16, 960],
  ])("a %f-hour lead closes %i minutes before departure", (hours, minutes) => {
    const { closesAt } = getBookingWindow({ departsAt, minLeadTimeHours: hours });
    expect(departsAt.getTime() - closesAt.getTime()).toBe(minutes * 60_000);
    // minLeadTimeHours is a Float and 0.1 * 3_600_000 is not an integer number
    // of milliseconds, so the helper rounds. Whole ms or the Date is fractional.
    expect(closesAt.getTime() % 1).toBe(0);
  });
});

describe("schedule.create — the path that DOES enforce the cutoff", () => {
  // No Schedule row for DAY, so the resolver returns schedule.create.
  it("refuses a booking made inside the lead time", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(hoursBefore(1)); // 2h lead, only 1h to go

    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({ packageId: base.pkg.id, selectedScheduleDate: DAY }),
      ),
    ).rejects.toThrow(/too late/i);

    expect(razorpayMock.callCount()).toBe(0);
  });

  it("accepts a booking made just outside the lead time", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(hoursBefore(2.5));

    await caller.user.createRazorPayIntent(
      bookingInput({ packageId: base.pkg.id, selectedScheduleDate: DAY }),
    );

    expect(razorpayMock.callCount()).toBe(1);
  });

  it("refuses a booking after the boat has sailed", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(departsAt.getTime() + 3_600_000));

    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({ packageId: base.pkg.id, selectedScheduleDate: DAY }),
      ),
    ).rejects.toThrow(/too late/i);
  });

  it("honours a per-package lead time longer than the default", async () => {
    // Breakfast's 16h cutoff reaches back to the previous evening.
    await db.package.update({
      where: { id: base.pkg.id },
      data: { minLeadTimeHours: 16 },
    });

    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(hoursBefore(10)); // fine at 2h, too late at 16h

    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({ packageId: base.pkg.id, selectedScheduleDate: DAY }),
      ),
    ).rejects.toThrow(/too late/i);
  });

  it("falls back to BookingConfig when the package sets no lead time", async () => {
    await db.package.update({
      where: { id: base.pkg.id },
      data: { minLeadTimeHours: null },
    });
    await db.bookingConfig.update({
      where: { id: "singleton" },
      data: { defaultMinLeadTimeHours: 6 },
    });

    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(hoursBefore(4)); // inside 6h, outside 2h

    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({ packageId: base.pkg.id, selectedScheduleDate: DAY }),
      ),
    ).rejects.toThrow(/too late/i);
  });
});

describe("day boundaries", () => {
  /**
   * A 00:30 IST departure is 19:00Z on the PREVIOUS UTC day. Booking it at
   * 22:00 IST the evening before is 16:30Z — same UTC day as the customer's
   * "yesterday", different IST day. Every comparison has to be on instants, not
   * on calendar days, or this either opens or closes at the wrong moment.
   */
  it("handles a sailing just after IST midnight", async () => {
    await db.package.update({
      where: { id: base.pkg.id },
      data: { startMinutesIst: 30, duration: 120 },
    });

    const midnightDeparture = istInstant(DAY, 30);
    vi.useFakeTimers({ toFake: ["Date"] });

    // 2.5h before a 00:30 IST departure = 22:00 IST on the PREVIOUS IST day.
    vi.setSystemTime(new Date(midnightDeparture.getTime() - 2.5 * 3_600_000));
    await caller.user.createRazorPayIntent(
      bookingInput({ packageId: base.pkg.id, selectedScheduleDate: DAY }),
    );
    expect(razorpayMock.callCount()).toBe(1);

    // 1h before the same departure = 23:30 IST, inside the 2h lead.
    vi.setSystemTime(new Date(midnightDeparture.getTime() - 3_600_000));
    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({ packageId: base.pkg.id, selectedScheduleDate: DAY }),
      ),
    ).rejects.toThrow(/too late/i);
    expect(razorpayMock.callCount()).toBe(1); // still just the one
  });

  it("does not let a departure drift a day when the host clock is west of UTC", () => {
    // istInstant is the write-side rule; the CHECK constraint is the read-side
    // one. Both are TZ-free by construction — this asserts the pair agrees for
    // a time of day that lands on a different UTC date.
    const late = istInstant(DAY, 30); // 00:30 IST
    expect(late.toISOString()).toContain(addDaysToKey(DAY, -1));
    expect(
      isWithinBookingWindow({
        departsAt: late,
        minLeadTimeHours: 2,
        now: new Date(late.getTime() - 3 * 3_600_000),
      }),
    ).toBe(true);
  });
});

describe("schedule.existing — KNOWN GAP: no lead-time gate at all", () => {
  /**
   * `src/lib/helpers/bookingLink/expiry.ts` says this outright:
   *
   *   "It also closes a gap in the existing flow — `schedule.existing` orders
   *    have no lead-time gate at all today, so without this a link could be paid
   *    ten minutes before the boat leaves."
   *
   * Confirmed: userBookingExistingScheduleTRPC.ts contains no reference to
   * isWithinBookingWindow, getBookingWindow or minLeadTimeHours. Whether a
   * sailing is still bookable therefore depends on whether a Schedule row
   * happens to exist for that date — the same customer, same package, same
   * minute, is refused if the date is empty and charged if it is not.
   *
   * Asserted as-is so the asymmetry is visible and a fix is a deliberate change.
   * When the gate is added, this test flips to `.rejects` and the one below it
   * can go.
   */
  it("charges for a sailing ten minutes from departure", async () => {
    await makeSchedule({
      day: DAY,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(departsAt.getTime() - 10 * 60_000));

    // No throw. An order is created and the customer is taken to checkout.
    await caller.user.createRazorPayIntent(
      bookingInput({ packageId: base.pkg.id, selectedScheduleDate: DAY }),
    );
    expect(razorpayMock.callCount()).toBe(1);
  });

  it("even charges for a sailing that has already departed", async () => {
    await makeSchedule({
      day: DAY,
      packageId: base.pkg.id,
      packageStartMinutesIst: base.pkg.startMinutesIst,
      packageDurationMinutes: base.pkg.duration,
    });

    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(departsAt.getTime() + 6 * 3_600_000));

    await caller.user.createRazorPayIntent(
      bookingInput({ packageId: base.pkg.id, selectedScheduleDate: DAY }),
    );
    expect(razorpayMock.callCount()).toBe(1);
  });

  it("the same moment IS refused when no schedule row exists", async () => {
    // The asymmetry, stated as a single assertion: identical request, identical
    // clock, opposite outcome — decided only by whether the row is there.
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(departsAt.getTime() - 10 * 60_000));

    await expect(
      caller.user.createRazorPayIntent(
        bookingInput({ packageId: base.pkg.id, selectedScheduleDate: DAY }),
      ),
    ).rejects.toThrow(/too late/i);
  });
});
