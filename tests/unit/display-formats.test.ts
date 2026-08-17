/**
 * Assertions for the display layer of src/lib/datetime.ts — IST_PATTERNS and the
 * four formatters that apply them. Ported from scripts/assert-display-formats.ts.
 *
 * WHY THIS IS SEPARATE from datetime.test.ts: a wrong *pattern* is not a type
 * error. `EEEE dd,yyyy` silently dropped the month for months. The only thing
 * that catches that class is a golden value written down by hand, so these are
 * golden values — every one was read off the date-fns render it replaces, and
 * any diff here is a deliberate decision, not a rounding.
 *
 * These must hold under any host TZ *and* any host LOCALE. The locale axis is
 * one the TZ matrix structurally cannot see: Luxon's `toFormat` re-defaults to
 * English internally, and this file is what stops a future `.setLocale()` or
 * `toLocaleString()` from silently making output machine-dependent.
 * `make test-matrix` runs both axes.
 */
import { describe, expect, it } from "vitest";
import {
  EMPTY_DISPLAY,
  formatDayKey,
  formatIstDate,
  formatIstDateTime,
  formatIstRange,
  formatIstTime,
  IST_PATTERNS,
  type IstDayKey,
  type IstPattern,
} from "@/lib/datetime";

const key = (s: string) => s as IstDayKey;

// 2026-08-16 is a Sunday. 03:30Z is 09:00 IST — comfortably mid-day in IST, so
// this block tests the pattern table, not the zone conversion.
const NOON_ISH = new Date("2026-08-16T03:30:00.000Z");
const DAY = key("2026-08-16");

const EXPECTED: Record<IstPattern, string> = {
  time: "9:00 AM",
  date: "16-08-2026",
  dateSlash: "16/08/2026",
  dayMonth: "16/08",
  dateWeekday: "Sun 16-08-2026",
  dateLong: "16 Aug 2026",
  dateLongWeekday: "Sun 16 Aug 2026",
  dateFull: "Sunday 16 August 2026",
  monthDayYear: "Aug 16, 2026",
  dateMedium: "16-Aug-26",
  dateOrdinal: "August 16th, 2026",
  dayOrdinalMonth: "16th of Aug",
  monthOrdinalWeekday: "August 16th, Sunday",
  weekday: "Sunday",
  month: "August",
  monthYear: "Aug 2026",
};

const PATTERNS = Object.keys(IST_PATTERNS) as IstPattern[];

describe("IST_PATTERNS via formatIstDate (instant)", () => {
  it.each(PATTERNS)("formatIstDate %s", (p) => {
    expect(formatIstDate(NOON_ISH, p)).toBe(EXPECTED[p]);
  });
});

describe("formatDayKey agrees with formatIstDate on the same day", () => {
  // A day key and an instant on the same IST day must render identically for
  // every date pattern. `time` is the one exception: a day key has no time, so
  // it renders midnight. That asymmetry is the point of having two functions.
  it.each(PATTERNS.filter((p) => p !== "time"))("formatDayKey %s", (p) => {
    expect(formatDayKey(DAY, p)).toBe(EXPECTED[p]);
  });

  it("formatDayKey time is midnight", () =>
    expect(formatDayKey(DAY, "time")).toBe("12:00 AM"));
});

describe("ordinals", () => {
  // Intl.PluralRules is the only nontrivial code in the registry, and 11/12/13
  // are exactly what a naive `n % 10` gets wrong.
  const ORDINALS: [string, string][] = [
    ["2026-08-01", "1st of Aug"],
    ["2026-08-02", "2nd of Aug"],
    ["2026-08-03", "3rd of Aug"],
    ["2026-08-04", "4th of Aug"],
    ["2026-08-11", "11th of Aug"],
    ["2026-08-12", "12th of Aug"],
    ["2026-08-13", "13th of Aug"],
    ["2026-08-21", "21st of Aug"],
    ["2026-08-22", "22nd of Aug"],
    ["2026-08-23", "23rd of Aug"],
    ["2026-08-31", "31st of Aug"],
  ];

  it.each(ORDINALS)("dayOrdinalMonth %s", (k, expected) => {
    expect(formatDayKey(key(k), "dayOrdinalMonth")).toBe(expected);
  });

  it("dateOrdinal 11th", () =>
    expect(formatDayKey(key("2026-08-11"), "dateOrdinal")).toBe("August 11th, 2026"));
  it("monthOrdinalWeekday 1st", () =>
    expect(formatDayKey(key("2026-08-01"), "monthOrdinalWeekday")).toBe(
      "August 1st, Saturday",
    ));
});

describe("single-digit day", () => {
  // `dateLong`/`dateLongWeekday` use `d`, not `dd` — this locks in that decision
  // so it cannot drift back silently.
  const D3 = key("2026-08-03");

  it("dateLong is unpadded", () => expect(formatDayKey(D3, "dateLong")).toBe("3 Aug 2026"));
  it("dateLongWeekday is unpadded", () =>
    expect(formatDayKey(D3, "dateLongWeekday")).toBe("Mon 3 Aug 2026"));
  it("date stays padded", () => expect(formatDayKey(D3, "date")).toBe("03-08-2026"));
  it("dateSlash stays padded", () =>
    expect(formatDayKey(D3, "dateSlash")).toBe("03/08/2026"));
  it("monthDayYear stays padded", () =>
    expect(formatDayKey(D3, "monthDayYear")).toBe("Aug 03, 2026"));
});

describe("instant whose UTC day != IST day", () => {
  // THE CASE THAT MATTERS. 2026-08-16T19:00:00Z is 2026-08-17 00:30 IST. Every
  // pattern must say the 17th. Under a host TZ west of UTC the old date-fns
  // render said the 16th, and west of that, the 15th.
  const PAST_IST_MIDNIGHT = new Date("2026-08-16T19:00:00.000Z");

  it("date", () => expect(formatIstDate(PAST_IST_MIDNIGHT, "date")).toBe("17-08-2026"));
  it("dateFull", () =>
    expect(formatIstDate(PAST_IST_MIDNIGHT, "dateFull")).toBe("Monday 17 August 2026"));
  it("dateWeekday", () =>
    expect(formatIstDate(PAST_IST_MIDNIGHT, "dateWeekday")).toBe("Mon 17-08-2026"));
  it("dayOrdinalMonth", () =>
    expect(formatIstDate(PAST_IST_MIDNIGHT, "dayOrdinalMonth")).toBe("17th of Aug"));
  it("time", () => expect(formatIstTime(PAST_IST_MIDNIGHT)).toBe("12:30 AM"));
  it("formatIstDateTime carries the zone", () =>
    expect(formatIstDateTime(PAST_IST_MIDNIGHT)).toBe("17 Aug 2026, 12:30 AM IST"));

  // The mirror case: 18:29:59Z is still 2026-08-16 23:59:59 IST.
  it("just before IST midnight", () =>
    expect(formatIstDate(new Date("2026-08-16T18:29:59.000Z"), "date")).toBe("16-08-2026"));
  it("one second later", () =>
    expect(formatIstDate(new Date("2026-08-16T18:30:00.000Z"), "date")).toBe("17-08-2026"));
});

describe("invalid input never leaks 'Invalid DateTime' to a customer", () => {
  const CASES = [
    ["null", null],
    ["undefined", undefined],
    ["Invalid Date", new Date("nope")],
  ] as const;

  it.each(CASES)("formatIstDate %s", (_label, value) =>
    expect(formatIstDate(value, "dateFull")).toBe(EMPTY_DISPLAY),
  );
  it.each(CASES)("formatIstTime %s", (_label, value) =>
    expect(formatIstTime(value)).toBe(EMPTY_DISPLAY),
  );
  it.each(CASES)("formatIstDateTime %s", (_label, value) =>
    expect(formatIstDateTime(value)).toBe(EMPTY_DISPLAY),
  );

  it("formatDayKey null", () => expect(formatDayKey(null, "date")).toBe(EMPTY_DISPLAY));
  it("formatDayKey undefined", () =>
    expect(formatDayKey(undefined, "date")).toBe(EMPTY_DISPLAY));
  it("formatDayKey garbage", () =>
    expect(formatDayKey(key("not-a-day"), "date")).toBe(EMPTY_DISPLAY));
  it("formatIstRange both null", () =>
    expect(formatIstRange(null, null)).toBe(EMPTY_DISPLAY));
});

describe("formatIstRange", () => {
  it("same day", () =>
    expect(
      formatIstRange(
        new Date("2026-08-16T03:30:00.000Z"),
        new Date("2026-08-16T05:30:00.000Z"),
      ),
    ).toBe("9:00 AM – 11:00 AM"));

  // The midnight crossing the old two-string render could not express at all.
  it("crosses midnight", () =>
    expect(
      formatIstRange(
        new Date("2026-08-16T16:30:00.000Z"),
        new Date("2026-08-16T18:30:00.000Z"),
      ),
    ).toBe("10:00 PM – 12:00 AM (+1)"));

  it("missing end", () =>
    expect(formatIstRange(new Date("2026-08-16T03:30:00.000Z"), null)).toBe(
      `9:00 AM – ${EMPTY_DISPLAY}`,
    ));
});
