/**
 * End-to-end flow assertions against a real database. Ported from
 * scripts/assert-booking-flows.ts.
 *
 * The other ported suites test pure functions. This one exercises the full write
 * path — the same `deriveScheduleInstants` rule the admin procedures use, through
 * Prisma, into real `timestamptz` columns and back — because the failure modes
 * this migration is about (a @db.Date read with local fields, an instant stored a
 * day off) only appear once a value has made the round trip.
 *
 * Deliberately meaningful under a NON-UTC TZ. Every assertion is written in IST
 * terms and must hold regardless of the host, which is what `make test-matrix`
 * checks.
 *
 * The original tagged every row with the year 2099 and deleted it in a `finally`,
 * because it shared the dev database with real data. `minar_test` is truncated
 * per test instead, so the dates here are ordinary ones.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import {
  dayKeyOfDateColumn,
  formatIstRange,
  istDayKeyOf,
  istMinutesOfInstant,
  type IstDayKey,
} from "@/lib/datetime";
import { deriveScheduleInstants } from "@/lib/helpers/scheduleInstants";
import { resolveBookingLinkExpiry } from "@/lib/helpers/bookingLink/expiry";
import { resetDb, type Baseline } from "../helpers/db";

const key = (s: string) => s as IstDayKey;

const DAY_CROSSING = key("2026-11-23");
const DAY_AFTERNOON = key("2026-11-24");
const DAY_INHERIT = key("2026-11-25");

let base: Baseline;

beforeEach(async () => {
  base = await resetDb();
});

describe("FLOW 1 — admin EXCLUSIVE schedule crossing midnight (22:00 -> 00:00)", () => {
  // The case the old split model could not represent at all: the return is on
  // the following IST day, so as a time-of-day string it read as eight hours
  // before the departure.
  it("stores and reads back a sailing that returns on the next IST day", async () => {
    const pkg = base.pkg;
    const crossing = deriveScheduleInstants({
      day: DAY_CROSSING,
      packageStartMinutesIst: pkg.startMinutesIst,
      packageDurationMinutes: pkg.duration,
      overrideStartMinutes: 1320, // 22:00 IST
      overrideEndMinutes: 0, // 00:00 IST next day — 0 must not read as "absent"
    });

    const row = await db.schedule.create({
      data: {
        day: new Date(`${DAY_CROSSING}T00:00:00.000Z`),
        packageId: pkg.id,
        startsAt: crossing.startsAt,
        endsAt: crossing.endsAt,
        isTimeOverridden: crossing.isTimeOverridden,
        schedulePackage: "CUSTOM",
        scheduleStatus: "AVAILABLE",
      },
    });

    const read = await db.schedule.findUniqueOrThrow({ where: { id: row.id } });

    expect(dayKeyOfDateColumn(read.day)).toBe(DAY_CROSSING);
    expect(istDayKeyOf(read.startsAt!)).toBe("2026-11-23");
    expect(istDayKeyOf(read.endsAt!)).toBe("2026-11-24");
    expect(read.endsAt! > read.startsAt!).toBe(true);
    expect(istMinutesOfInstant(read.startsAt!)).toBe(1320); // 22:00 IST
    expect(istMinutesOfInstant(read.endsAt!)).toBe(0); //      00:00 IST
    expect(read.isTimeOverridden).toBe(true);
    expect(formatIstRange(read.startsAt, read.endsAt)).toBe("10:00 PM – 12:00 AM (+1)");

    // THE invariant the 004_contract CHECK constraint enforces.
    expect(istDayKeyOf(read.startsAt!)).toBe(dayKeyOfDateColumn(read.day));
  });

  it("the database itself refuses a row whose day disagrees with startsAt", async () => {
    // Not in the original script — worth having, because the constraint is the
    // structural guarantee behind every assertion above, and a test DB built by
    // `prisma db push` alone would silently not have it.
    await expect(
      db.schedule.create({
        data: {
          day: new Date("2026-11-23T00:00:00.000Z"),
          packageId: base.pkg.id,
          // 09:00 IST on the 24th — one day off from the `day` column.
          startsAt: new Date("2026-11-24T03:30:00.000Z"),
          endsAt: new Date("2026-11-24T05:30:00.000Z"),
          schedulePackage: "CUSTOM",
          scheduleStatus: "AVAILABLE",
        },
      }),
    ).rejects.toThrow(/Schedule_day_matches_startsAt/);
  });
});

describe("FLOW 2 — a 1-9 o'clock time (the case the validators disagreed on)", () => {
  // As "4:30:PM" this was accepted by the parser and rejected by moment's strict
  // hh:mm:A, so one procedure kept it and the other silently dropped it.
  it("keeps an unpadded-hour time through the round trip", async () => {
    const pkg = base.pkg;
    const afternoon = deriveScheduleInstants({
      day: DAY_AFTERNOON,
      packageStartMinutesIst: pkg.startMinutesIst,
      packageDurationMinutes: pkg.duration,
      overrideStartMinutes: 990, // 16:30 — "4:30 PM"
      overrideEndMinutes: 1110, // 18:30 — "6:30 PM"
    });

    const row = await db.schedule.create({
      data: {
        day: new Date(`${DAY_AFTERNOON}T00:00:00.000Z`),
        packageId: pkg.id,
        startsAt: afternoon.startsAt,
        endsAt: afternoon.endsAt,
        isTimeOverridden: afternoon.isTimeOverridden,
        schedulePackage: "CUSTOM",
        scheduleStatus: "AVAILABLE",
      },
    });

    const read = await db.schedule.findUniqueOrThrow({ where: { id: row.id } });

    expect(istMinutesOfInstant(read.startsAt!)).toBe(990);
    expect(istMinutesOfInstant(read.endsAt!)).toBe(1110);
    expect(formatIstRange(read.startsAt, read.endsAt)).toBe("4:30 PM – 6:30 PM");
    expect(istDayKeyOf(read.startsAt!)).toBe(DAY_AFTERNOON);
  });
});

describe("FLOW 3 — a normal schedule inheriting the package's departure", () => {
  it("derives both instants from the package", async () => {
    const pkg = base.pkg;
    const inherited = deriveScheduleInstants({
      day: DAY_INHERIT,
      packageStartMinutesIst: pkg.startMinutesIst,
      packageDurationMinutes: pkg.duration,
      overrideStartMinutes: null,
      overrideEndMinutes: null,
    });

    const row = await db.schedule.create({
      data: {
        day: new Date(`${DAY_INHERIT}T00:00:00.000Z`),
        packageId: pkg.id,
        startsAt: inherited.startsAt,
        endsAt: inherited.endsAt,
        isTimeOverridden: inherited.isTimeOverridden,
        schedulePackage: "BREAKFAST",
        scheduleStatus: "AVAILABLE",
      },
    });

    const read = await db.schedule.findUniqueOrThrow({ where: { id: row.id } });

    expect(istMinutesOfInstant(read.startsAt!)).toBe(pkg.startMinutesIst);
    expect(istMinutesOfInstant(read.endsAt!)).toBe(
      (pkg.startMinutesIst + pkg.duration) % 1440,
    );
    expect(read.isTimeOverridden).toBe(false);
    expect(istDayKeyOf(read.startsAt!)).toBe(DAY_INHERIT);
  });
});

describe("FLOW 4 — booking-link snapshot does not drift when the package moves", () => {
  // A link freezes the departure at generation. Editing the package afterwards
  // must not move a link already sent to a customer.
  it("keeps the frozen departure while the schedule follows the edit", async () => {
    const pkg = base.pkg;
    const inherited = deriveScheduleInstants({
      day: DAY_INHERIT,
      packageStartMinutesIst: pkg.startMinutesIst,
      packageDurationMinutes: pkg.duration,
    });

    const row = await db.schedule.create({
      data: {
        day: new Date(`${DAY_INHERIT}T00:00:00.000Z`),
        packageId: pkg.id,
        startsAt: inherited.startsAt,
        endsAt: inherited.endsAt,
        isTimeOverridden: inherited.isTimeOverridden,
        schedulePackage: "BREAKFAST",
        scheduleStatus: "AVAILABLE",
      },
    });

    const read = await db.schedule.findUniqueOrThrow({ where: { id: row.id } });
    const frozenStartsAt = read.startsAt!;
    const frozenEndsAt = read.endsAt!;

    const expiry = resolveBookingLinkExpiry({
      departsAt: frozenStartsAt,
      expiryHours: 48,
      rule: {
        minLeadTimeHours: 2,
        minNewBookingCount: 0,
        isBookableOnline: true,
        maxBoatSeat: 50,
      },
      now: new Date(frozenStartsAt.getTime() - 72 * 3600 * 1000),
    });
    expect(expiry.expiresAt <= frozenStartsAt).toBe(true);

    // Now move the package's departure by an hour and re-derive the schedule.
    const moved = deriveScheduleInstants({
      day: DAY_INHERIT,
      packageStartMinutesIst: pkg.startMinutesIst + 60,
      packageDurationMinutes: pkg.duration,
    });
    await db.schedule.update({
      where: { id: row.id },
      data: { startsAt: moved.startsAt, endsAt: moved.endsAt },
    });

    const readMoved = await db.schedule.findUniqueOrThrow({ where: { id: row.id } });

    expect(istMinutesOfInstant(readMoved.startsAt!)).toBe(pkg.startMinutesIst + 60);
    expect(frozenStartsAt.getTime()).not.toBe(readMoved.startsAt!.getTime());
    expect(frozenEndsAt > frozenStartsAt).toBe(true);
  });
});
