/**
 * Assertions for `deriveScheduleInstants` — the single write-time rule that turns
 * (day, package times, admin overrides) into the `startsAt`/`endsAt` instants
 * every screen renders. Ported from scripts/assert-schedule-instants.ts.
 *
 * The row counts in the headings are real production counts: this is the rule
 * that had to reproduce 748 existing schedules exactly during the backfill.
 */
import { describe, expect, it } from "vitest";
import { formatIstRange, istDayKeyOf, type IstDayKey } from "@/lib/datetime";
import { deriveScheduleInstants } from "@/lib/helpers/scheduleInstants";

const key = (s: string) => s as IstDayKey;

describe("AVAILABLE — inherits the package's departure (495 prod rows)", () => {
  const inherited = deriveScheduleInstants({
    day: key("2026-08-16"),
    packageStartMinutesIst: 540, // 09:00 breakfast
    packageDurationMinutes: 120,
  });

  it("startsAt = 09:00 IST", () =>
    expect(inherited.startsAt).toEqual(new Date("2026-08-16T03:30:00.000Z")));
  it("endsAt = 11:00 IST", () =>
    expect(inherited.endsAt).toEqual(new Date("2026-08-16T05:30:00.000Z")));
  it("not flagged as overridden", () => expect(inherited.isTimeOverridden).toBe(false));
  it("no review needed", () => expect(inherited.needsTimeReview).toBe(false));
});

describe("EXCLUSIVE — explicit override wins over the package (23 prod rows)", () => {
  const override = deriveScheduleInstants({
    day: key("2025-11-11"),
    packageStartMinutesIst: 1020, // package says 17:00
    packageDurationMinutes: 240,
    overrideStartMinutes: 780, // admin says 13:00
    overrideEndMinutes: 900,
  });

  it("startsAt follows the override", () =>
    expect(override.startsAt).toEqual(new Date("2025-11-11T07:30:00.000Z")));
  it("endsAt follows the override", () =>
    expect(override.endsAt).toEqual(new Date("2025-11-11T09:30:00.000Z")));
  it("marked as overridden", () => expect(override.isTimeOverridden).toBe(true));

  // 16:30 — an afternoon override. As the string "4:30:PM" this was the case the
  // two validators disagreed about: moment's strict `hh:mm:A` rejected the
  // unpadded hour that the parser accepted, so the admin's time was silently
  // dropped and the slot rendered as a bare " - ". A minute count has no padding
  // to disagree about.
  const unpadded = deriveScheduleInstants({
    day: key("2026-08-16"),
    packageStartMinutesIst: 540,
    packageDurationMinutes: 120,
    overrideStartMinutes: 990, // 16:30
    overrideEndMinutes: 1110,
  });

  it("unpadded override parses", () =>
    expect(unpadded.startsAt).toEqual(new Date("2026-08-16T11:00:00.000Z")));
  it("unpadded override is not flagged", () =>
    expect(unpadded.needsTimeReview).toBe(false));
});

describe("BLOCKED — no package, no override, no sailing (229 prod rows)", () => {
  const blocked = deriveScheduleInstants({
    day: key("2026-08-16"),
    packageStartMinutesIst: null,
    packageDurationMinutes: null,
  });

  it("startsAt stays NULL", () => expect(blocked.startsAt).toBeNull());
  it("endsAt stays NULL", () => expect(blocked.endsAt).toBeNull());
  it("not flagged for review — this is correct, not broken", () =>
    expect(blocked.needsTimeReview).toBe(false));
  it("not overridden", () => expect(blocked.isTimeOverridden).toBe(false));
});

describe("Midnight crossing — production row 2025-11-23 22:00 -> 00:00", () => {
  const crossing = deriveScheduleInstants({
    day: key("2025-11-23"),
    packageStartMinutesIst: 1020,
    packageDurationMinutes: 240,
    overrideStartMinutes: 1320, // 22:00
    overrideEndMinutes: 0, // midnight — 0 must count as an override, not as absent
  });

  it("departs on the 23rd", () =>
    expect(istDayKeyOf(crossing.startsAt!)).toBe("2025-11-23"));
  it("returns on the 24th", () => expect(istDayKeyOf(crossing.endsAt!)).toBe("2025-11-24"));
  it("endsAt is after startsAt", () =>
    expect(crossing.endsAt! > crossing.startsAt!).toBe(true));
  it("not flagged — this is a real sailing", () =>
    expect(crossing.needsTimeReview).toBe(false));
  it("renders with the (+1) marker", () =>
    expect(formatIstRange(crossing.startsAt, crossing.endsAt)).toBe(
      "10:00 PM – 12:00 AM (+1)",
    ));
});

describe("Implausible — production row 2025-11-13 23:00 -> 15:00 (a typo)", () => {
  // Rolling this to the next day would invent a 16-hour cruise. Refuse instead.
  const implausible = deriveScheduleInstants({
    day: key("2025-11-13"),
    packageStartMinutesIst: 1020,
    packageDurationMinutes: 240,
    overrideStartMinutes: 1380, // 23:00
    overrideEndMinutes: 900, // 15:00
  });

  it("startsAt is still resolved", () =>
    expect(implausible.startsAt).toEqual(new Date("2025-11-13T17:30:00.000Z")));
  it("endsAt is refused, not guessed", () => expect(implausible.endsAt).toBeNull());
  it("flagged for a human", () => expect(implausible.needsTimeReview).toBe(true));

  // The boundary: exactly 6h is allowed, 6h1m is not.
  const atCeiling = deriveScheduleInstants({
    day: key("2026-08-16"),
    packageStartMinutesIst: 0,
    packageDurationMinutes: 0,
    overrideStartMinutes: 1320, // 22:00
    overrideEndMinutes: 240, // 04:00 -> +1440 = 1680, span exactly 360
  });

  it("exactly 6h crosses midnight", () => expect(atCeiling.needsTimeReview).toBe(false));
  it("6h endsAt is next day", () =>
    expect(istDayKeyOf(atCeiling.endsAt!)).toBe("2026-08-17"));

  const overCeiling = deriveScheduleInstants({
    day: key("2026-08-16"),
    packageStartMinutesIst: 0,
    packageDurationMinutes: 0,
    overrideStartMinutes: 1320, // 22:00
    overrideEndMinutes: 241, // span 361 > ceiling
  });

  it("6h01m is refused", () => expect(overCeiling.endsAt).toBeNull());
  it("6h01m is flagged", () => expect(overCeiling.needsTimeReview).toBe(true));
});

describe("Partial / malformed input", () => {
  const halfOverride = deriveScheduleInstants({
    day: key("2026-08-16"),
    packageStartMinutesIst: 540,
    packageDurationMinutes: 120,
    overrideStartMinutes: 600, // 10:00
    overrideEndMinutes: null, // only a start was set
  });

  it("half override starts at the override", () =>
    expect(halfOverride.startsAt).toEqual(new Date("2026-08-16T04:30:00.000Z")));
  it("half override ends via package duration", () =>
    expect(halfOverride.endsAt).toEqual(new Date("2026-08-16T06:30:00.000Z")));
  it("half override is NOT 'overridden'", () =>
    expect(halfOverride.isTimeOverridden).toBe(false));

  const garbage = deriveScheduleInstants({
    day: key("2026-08-16"),
    packageStartMinutesIst: 540,
    packageDurationMinutes: 120,
    overrideStartMinutes: NaN,
    overrideEndMinutes: 9999,
  });

  it("out-of-range override falls back to the package", () =>
    expect(garbage.startsAt).toEqual(new Date("2026-08-16T03:30:00.000Z")));

  const badDay = deriveScheduleInstants({
    day: "2026-02-30",
    packageStartMinutesIst: 540,
    packageDurationMinutes: 120,
  });

  it("an impossible day yields no instants", () => expect(badDay.startsAt).toBeNull());
});

describe("Midnight as an override — a state the string format could not express", () => {
  // 0 is a legal departure AND falsy. A `||` anywhere in the override path turns
  // it into "absent" and silently inherits the package's 09:00 instead. The old
  // "12:00:AM" string was truthy, so this bug was unreachable before the wire
  // format became numeric — which is exactly why it is asserted here.
  const midnightDeparture = deriveScheduleInstants({
    day: key("2026-08-16"),
    packageStartMinutesIst: 540, // package says 09:00
    packageDurationMinutes: 120,
    overrideStartMinutes: 0, // admin says midnight
    overrideEndMinutes: 180, // returning 03:00
  });

  it("midnight override is honoured, not inherited", () =>
    expect(midnightDeparture.startsAt).toEqual(
      new Date("2026-08-15T18:30:00.000Z"), // 2026-08-16 00:00 IST
    ));
  it("midnight departure is on the right IST day", () =>
    expect(istDayKeyOf(midnightDeparture.startsAt!)).toBe("2026-08-16"));
  it("midnight override counts as overridden", () =>
    expect(midnightDeparture.isTimeOverridden).toBe(true));
  it("midnight override is not flagged", () =>
    expect(midnightDeparture.needsTimeReview).toBe(false));

  // The end-time mirror: 0 as an END means midnight of the NEXT day, which is
  // the crossing case already covered above — assert it did not collapse to
  // "absent".
  const midnightReturn = deriveScheduleInstants({
    day: key("2026-08-16"),
    packageStartMinutesIst: 1320,
    packageDurationMinutes: 60,
    overrideStartMinutes: 1320, // 22:00
    overrideEndMinutes: 0, // 00:00 next day, NOT "no override"
  });

  it("midnight return crosses the day", () =>
    expect(istDayKeyOf(midnightReturn.endsAt!)).toBe("2026-08-17"));
  it("midnight return counts as overridden", () =>
    expect(midnightReturn.isTimeOverridden).toBe(true));
});

describe("The day-match invariant the CHECK constraint enforces", () => {
  // (startsAt AT TIME ZONE 'Asia/Kolkata')::date must equal `day`, for every
  // hour of the day — including the ones that fall on a different UTC date.
  it.each([0, 1, 330, 540, 1050, 1439])(
    "startsAt at %imin is still 2026-08-16 in IST",
    (minutes) => {
      const r = deriveScheduleInstants({
        day: key("2026-08-16"),
        packageStartMinutesIst: minutes,
        packageDurationMinutes: 60,
      });
      expect(istDayKeyOf(r.startsAt!)).toBe("2026-08-16");
    },
  );
});
