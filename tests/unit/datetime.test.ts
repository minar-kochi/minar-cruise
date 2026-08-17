/**
 * Assertions for src/lib/datetime.ts. Ported from scripts/assert-datetime.ts.
 *
 * THE POINT OF THIS FILE: every assertion below must hold identically no matter
 * what TZ the process runs under. That is the whole claim being made — that date
 * handling no longer depends on the host's timezone.
 *
 *   make test-matrix
 *
 * runs it under UTC, America/Los_Angeles (UTC-7/8), Pacific/Kiritimati (UTC+14),
 * Asia/Kolkata, Australia/Lord_Howe (a half-hour offset *with* DST) and
 * America/St_Johns (UTC-3:30). The first three bracket the real world: if a day
 * key is going to slip, it slips at one of those.
 */
import { describe, expect, it } from "vitest";
import {
  addDaysToKey,
  calendarDateToDayKey,
  compareDayKeys,
  countdownTo,
  dayKeyOfDateColumn,
  dayKeyRange,
  isSameMonthKey,
  istMinutesSchema,
  minutesSince,
  monthOfKey,
  dayKeyToCalendarDate,
  dayKeyToDateColumn,
  formatDayKey,
  formatIstDate,
  formatIstDateTime,
  formatIstMinutes,
  formatIstRange,
  formatIstTime,
  getBookingWindow,
  istDayKeyOf,
  istDayKeySchema,
  istInstant,
  istMinutesFromInput,
  istMinutesToInput,
  InvalidDateError,
  istToday,
  isWithinBookingWindow,
  parseIstDayKey,
  parseLegacyMeridiemTime,
  resolveSailingInstants,
  type IstDayKey,
} from "@/lib/datetime";

const key = (s: string) => s as IstDayKey;

describe("parseLegacyMeridiemTime — the three-colon format", () => {
  it("parses 09:00:AM", () => expect(parseLegacyMeridiemTime("09:00:AM")).toBe(540));
  it("treats 12:00:AM as midnight, not noon", () =>
    expect(parseLegacyMeridiemTime("12:00:AM")).toBe(0));
  it("treats 12:00:PM as noon", () => expect(parseLegacyMeridiemTime("12:00:PM")).toBe(720));
  it("parses 05:30:PM", () => expect(parseLegacyMeridiemTime("05:30:PM")).toBe(1050));
  // The unpadded hour the validator permits and moment's strict hh:mm:A rejected.
  it("parses 4:30:PM (unpadded)", () => expect(parseLegacyMeridiemTime("4:30:PM")).toBe(990));
  it("parses 11:59:PM", () => expect(parseLegacyMeridiemTime("11:59:PM")).toBe(1439));
  it("rejects 13:00:PM", () => expect(parseLegacyMeridiemTime("13:00:PM")).toBeNull());
  it("rejects 09:00 AM (space)", () => expect(parseLegacyMeridiemTime("09:00 AM")).toBeNull());
  it("rejects 09:60:AM", () => expect(parseLegacyMeridiemTime("09:60:AM")).toBeNull());
  it("rejects empty", () => expect(parseLegacyMeridiemTime("")).toBeNull());
  it("rejects null", () => expect(parseLegacyMeridiemTime(null)).toBeNull());
});

describe("istInstant — IST wall clock to UTC instant (IST is +05:30)", () => {
  it("2026-08-16 09:00 IST -> 03:30Z", () =>
    expect(istInstant(key("2026-08-16"), 540)).toEqual(
      new Date("2026-08-16T03:30:00.000Z"),
    ));
  it("2026-08-16 00:00 IST -> previous 18:30Z", () =>
    expect(istInstant(key("2026-08-16"), 0)).toEqual(
      new Date("2026-08-15T18:30:00.000Z"),
    ));
  it("2025-11-23 22:00 IST -> 16:30Z", () =>
    expect(istInstant(key("2025-11-23"), 1320)).toEqual(
      new Date("2025-11-23T16:30:00.000Z"),
    ));

  // The midnight-crossing case: 1440 minutes is 00:00 of the FOLLOWING IST day.
  // This is the production row 2025-11-23 "10:00:PM" -> "12:00:AM".
  it("2025-11-23 + 1440min -> 2025-11-24 00:00 IST", () =>
    expect(istInstant(key("2025-11-23"), 1440)).toEqual(
      new Date("2025-11-23T18:30:00.000Z"),
    ));
  it("and that instant reads back as the 24th in IST", () =>
    expect(istDayKeyOf(istInstant(key("2025-11-23"), 1440))).toBe("2025-11-24"));
});

describe("resolveSailingInstants", () => {
  const sail = resolveSailingInstants({
    day: key("2026-08-16"),
    startMinutesIst: 540,
    durationMinutes: 120,
  });

  it("breakfast starts 03:30Z", () =>
    expect(sail.startsAt).toEqual(new Date("2026-08-16T03:30:00.000Z")));
  it("breakfast ends 05:30Z", () =>
    expect(sail.endsAt).toEqual(new Date("2026-08-16T05:30:00.000Z")));

  const overnight = resolveSailingInstants({
    day: key("2025-11-23"),
    startMinutesIst: 1320, // 22:00
    durationMinutes: 120, // -> 00:00 next day
  });

  it("overnight ends next IST day", () =>
    expect(istDayKeyOf(overnight.endsAt)).toBe("2025-11-24"));
  it("overnight endsAt > startsAt", () =>
    expect(overnight.endsAt > overnight.startsAt).toBe(true));
});

describe("dayKeyOfDateColumn — @db.Date hydrates as UTC midnight", () => {
  // MUST be host-TZ independent. This is what the deleted RemoveTimeStampFromDate
  // got wrong: formatISO() rendered in local time, so west of UTC it returned
  // the day before.
  it("UTC midnight reads as its own day", () =>
    expect(dayKeyOfDateColumn(new Date("2026-08-16T00:00:00.000Z"))).toBe("2026-08-16"));
  it("Jan 1 does not slip to Dec 31", () =>
    expect(dayKeyOfDateColumn(new Date("2026-01-01T00:00:00.000Z"))).toBe("2026-01-01"));
  it("Dec 31 does not slip to Jan 1", () =>
    expect(dayKeyOfDateColumn(new Date("2025-12-31T00:00:00.000Z"))).toBe("2025-12-31"));
  it("round-trips through dayKeyToDateColumn", () =>
    expect(dayKeyOfDateColumn(dayKeyToDateColumn(key("2026-08-16")))).toBe("2026-08-16"));
  it("dayKeyToDateColumn is UTC midnight", () =>
    expect(dayKeyToDateColumn(key("2026-08-16"))).toEqual(
      new Date("2026-08-16T00:00:00.000Z"),
    ));
});

describe("istDayKeyOf — the IST midnight boundary (18:30Z)", () => {
  it("18:29Z is still the same IST day", () =>
    expect(istDayKeyOf(new Date("2026-08-16T18:29:59.000Z"))).toBe("2026-08-16"));
  it("18:30Z has rolled into the next IST day", () =>
    expect(istDayKeyOf(new Date("2026-08-16T18:30:00.000Z"))).toBe("2026-08-17"));

  // This is the bug behind "upcoming schedules" being wrong for 5.5h every night.
  it("istToday at 19:00Z is tomorrow in India", () =>
    expect(istToday(new Date("2026-08-16T19:00:00.000Z"))).toBe("2026-08-17"));
  it("istToday at 12:00Z is still today in India", () =>
    expect(istToday(new Date("2026-08-16T12:00:00.000Z"))).toBe("2026-08-16"));
});

describe("calendarDateToDayKey / dayKeyToCalendarDate — local midnight", () => {
  // react-day-picker hands back local midnight; these two must round-trip in
  // whatever zone the browser is in.
  const picked = dayKeyToCalendarDate(key("2026-08-16"));

  it("calendar Date is local midnight", () => expect(picked.getHours()).toBe(0));
  it("round-trips", () => expect(calendarDateToDayKey(picked)).toBe("2026-08-16"));
  it("round-trips across a year boundary", () =>
    expect(calendarDateToDayKey(dayKeyToCalendarDate(key("2026-01-01")))).toBe(
      "2026-01-01",
    ));
});

describe("parseIstDayKey / istDayKeySchema", () => {
  it("accepts a real date", () => expect(parseIstDayKey("2026-08-16")).toBe("2026-08-16"));
  it("rejects Feb 30", () => expect(parseIstDayKey("2026-02-30")).toBeNull());
  it("accepts a leap day", () => expect(parseIstDayKey("2024-02-29")).toBe("2024-02-29"));
  it("rejects a non-leap Feb 29", () => expect(parseIstDayKey("2026-02-29")).toBeNull());
  it("rejects an ISO instant", () =>
    expect(parseIstDayKey("2026-08-16T00:00:00Z")).toBeNull());
  it("rejects a slash format", () => expect(parseIstDayKey("16/08/2026")).toBeNull());
  it("rejects empty", () => expect(parseIstDayKey("")).toBeNull());
  it("zod schema accepts", () =>
    expect(istDayKeySchema.safeParse("2026-08-16").success).toBe(true));
  it("zod schema rejects", () =>
    expect(istDayKeySchema.safeParse("2026-02-30").success).toBe(false));
});

describe("day key arithmetic and ordering", () => {
  it("addDays across a month end", () =>
    expect(addDaysToKey(key("2026-08-31"), 1)).toBe("2026-09-01"));
  it("addDays across a year end", () =>
    expect(addDaysToKey(key("2025-12-31"), 1)).toBe("2026-01-01"));
  it("addDays negative", () => expect(addDaysToKey(key("2026-01-01"), -1)).toBe("2025-12-31"));
  it("compare earlier", () =>
    expect(compareDayKeys(key("2026-08-15"), key("2026-08-16"))).toBe(-1));
  it("compare equal", () =>
    expect(compareDayKeys(key("2026-08-16"), key("2026-08-16"))).toBe(0));
  it("compare later", () =>
    expect(compareDayKeys(key("2026-08-17"), key("2026-08-16"))).toBe(1));
});

describe("time-of-day formatting", () => {
  it("540 -> 9:00 AM", () => expect(formatIstMinutes(540)).toBe("9:00 AM"));
  it("0 -> 12:00 AM", () => expect(formatIstMinutes(0)).toBe("12:00 AM"));
  it("720 -> 12:00 PM", () => expect(formatIstMinutes(720)).toBe("12:00 PM"));
  it("1050 -> 5:30 PM", () => expect(formatIstMinutes(1050)).toBe("5:30 PM"));
  it("1439 -> 11:59 PM", () => expect(formatIstMinutes(1439)).toBe("11:59 PM"));
  it("1440 wraps to 12:00 AM", () => expect(formatIstMinutes(1440)).toBe("12:00 AM"));
  it("input round-trip 09:00", () =>
    expect(istMinutesToInput(istMinutesFromInput("09:00")!)).toBe("09:00"));
  it("input round-trip 17:30", () =>
    expect(istMinutesToInput(istMinutesFromInput("17:30")!)).toBe("17:30"));
  it("istMinutesFromInput('17:30')", () => expect(istMinutesFromInput("17:30")).toBe(1050));
  it("rejects 24:00", () => expect(istMinutesFromInput("24:00")).toBeNull());
  it("rejects 9:00 (unpadded)", () => expect(istMinutesFromInput("9:00")).toBeNull());
});

describe("instant formatting — always IST regardless of host TZ", () => {
  const noon = new Date("2026-08-16T03:30:00.000Z"); // 09:00 IST

  it("formatIstTime", () => expect(formatIstTime(noon)).toBe("9:00 AM"));
  it("formatIstDate", () => expect(formatIstDate(noon)).toBe("16-08-2026"));
  it("formatIstDate slash", () => expect(formatIstDate(noon, "dateSlash")).toBe("16/08/2026"));
  it("formatIstDate long", () => expect(formatIstDate(noon, "dateLong")).toBe("16 Aug 2026"));
  it("formatIstDateTime carries IST", () =>
    expect(formatIstDateTime(noon)).toBe("16 Aug 2026, 9:00 AM IST"));

  // An instant that is a different calendar day in UTC than in IST.
  const lateIst = new Date("2026-08-16T19:00:00.000Z"); // 00:30 IST on the 17th
  it("late-evening UTC renders as next IST day", () =>
    expect(formatIstDate(lateIst)).toBe("17-08-2026"));
  it("formatDayKey", () =>
    expect(formatDayKey(key("2026-08-16"), "dateLong")).toBe("16 Aug 2026"));
});

describe("invalid input never leaks 'Invalid DateTime'", () => {
  it("formatIstTime(null)", () => expect(formatIstTime(null)).toBe("—"));
  it("formatIstDate(undefined)", () => expect(formatIstDate(undefined)).toBe("—"));
  it("formatIstDateTime(bad Date)", () =>
    expect(formatIstDateTime(new Date("nope"))).toBe("—"));
  it("formatIstRange(null,null)", () => expect(formatIstRange(null, null)).toBe("—"));

  // The day-key functions THROW on an invalid Date rather than returning null:
  // their inputs come from Prisma columns, a date picker or the clock, never
  // from user text, so an invalid one is a programming error. A nullable return
  // would have forced a `?? ""` at ~130 call sites, and the likely response to
  // each would have been to silence it. String input still goes through
  // `parseIstDayKey`, which returns null.
  it("dayKeyOfDateColumn(bad Date) throws", () =>
    expect(() => dayKeyOfDateColumn(new Date("nope"))).toThrow(InvalidDateError));
  it("istDayKeyOf(bad Date) throws", () =>
    expect(() => istDayKeyOf(new Date("nope"))).toThrow(InvalidDateError));
  it("calendarDateToDayKey(bad Date) throws", () =>
    expect(() => calendarDateToDayKey(new Date("nope"))).toThrow(InvalidDateError));
});

describe("formatIstRange — the (+1) that the old {fromTime}-{toTime} could not show", () => {
  it("same-day range", () =>
    expect(
      formatIstRange(
        istInstant(key("2026-08-16"), 540),
        istInstant(key("2026-08-16"), 660),
      ),
    ).toBe("9:00 AM – 11:00 AM"));
  it("midnight crossing is marked", () =>
    expect(
      formatIstRange(
        istInstant(key("2025-11-23"), 1320),
        istInstant(key("2025-11-23"), 1440),
      ),
    ).toBe("10:00 PM – 12:00 AM (+1)"));
});

describe("booking window", () => {
  const departs = new Date("2026-08-16T03:30:00.000Z");

  it("2h lead closes 2h earlier", () =>
    expect(getBookingWindow({ departsAt: departs, minLeadTimeHours: 2 }).closesAt).toEqual(
      new Date("2026-08-16T01:30:00.000Z"),
    ));
  it("fractional lead is rounded to whole ms", () =>
    expect(
      getBookingWindow({ departsAt: departs, minLeadTimeHours: 0.1 }).closesAt,
    ).toEqual(new Date("2026-08-16T03:24:00.000Z")));
  it("16h breakfast lead reaches the previous evening", () =>
    expect(
      getBookingWindow({ departsAt: departs, minLeadTimeHours: 16 }).closesAt,
    ).toEqual(new Date("2026-08-15T11:30:00.000Z")));
  it("zero lead means departure is the cutoff", () =>
    expect(getBookingWindow({ departsAt: departs, minLeadTimeHours: 0 }).closesAt).toEqual(
      departs,
    ));

  it("open well before", () =>
    expect(
      isWithinBookingWindow({
        departsAt: departs,
        minLeadTimeHours: 2,
        now: new Date("2026-08-16T00:00:00.000Z"),
      }),
    ).toBe(true));
  it("closed inside the lead time", () =>
    expect(
      isWithinBookingWindow({
        departsAt: departs,
        minLeadTimeHours: 2,
        now: new Date("2026-08-16T02:00:00.000Z"),
      }),
    ).toBe(false));
  it("closed after it sailed", () =>
    expect(
      isWithinBookingWindow({
        departsAt: departs,
        minLeadTimeHours: 2,
        now: new Date("2026-08-16T09:00:00.000Z"),
      }),
    ).toBe(false));
});

/**
 * The 0 case is load-bearing: midnight is a legal departure AND falsy, so any
 * `||` in a numeric override path would silently turn it into "absent". That is
 * a state the old "4:30:PM" string format could not even represent, which is why
 * it is asserted here rather than left to review.
 */
describe("istMinutesSchema", () => {
  it("accepts 0 (midnight)", () => expect(istMinutesSchema.safeParse(0).success).toBe(true));
  it("accepts 540 (09:00)", () => expect(istMinutesSchema.safeParse(540).success).toBe(true));
  it("accepts 1439 (23:59)", () =>
    expect(istMinutesSchema.safeParse(1439).success).toBe(true));
  it("rejects 1440", () => expect(istMinutesSchema.safeParse(1440).success).toBe(false));
  it("rejects -1", () => expect(istMinutesSchema.safeParse(-1).success).toBe(false));
  it("rejects fractional", () => expect(istMinutesSchema.safeParse(90.5).success).toBe(false));
  it("rejects a string", () => expect(istMinutesSchema.safeParse("540").success).toBe(false));
  it("rejects NaN", () => expect(istMinutesSchema.safeParse(NaN).success).toBe(false));
});

describe("month helpers", () => {
  it("same month", () =>
    expect(isSameMonthKey(key("2026-08-01"), key("2026-08-31"))).toBe(true));
  it("adjacent months differ", () =>
    expect(isSameMonthKey(key("2026-08-31"), key("2026-09-01"))).toBe(false));
  it("same month across a year differs", () =>
    expect(isSameMonthKey(key("2025-08-16"), key("2026-08-16"))).toBe(false));
  it("monthOfKey is 1-based (Jan)", () => expect(monthOfKey(key("2026-01-15"))).toBe(1));
  it("monthOfKey is 1-based (Aug)", () => expect(monthOfKey(key("2026-08-15"))).toBe(8));
  it("monthOfKey is 1-based (Dec)", () => expect(monthOfKey(key("2026-12-15"))).toBe(12));
});

describe("dayKeyRange — inclusive, bounded, empty rather than infinite when reversed", () => {
  it("single day is inclusive", () =>
    expect(dayKeyRange(key("2026-08-16"), key("2026-08-16"))).toEqual(["2026-08-16"]));
  it("spans a month end", () =>
    expect(dayKeyRange(key("2026-08-30"), key("2026-09-02"))).toEqual([
      "2026-08-30",
      "2026-08-31",
      "2026-09-01",
      "2026-09-02",
    ]));
  it("spans a leap day", () =>
    expect(dayKeyRange(key("2024-02-28"), key("2024-03-01"))).toEqual([
      "2024-02-28",
      "2024-02-29",
      "2024-03-01",
    ]));
  it("reversed range is empty", () =>
    expect(dayKeyRange(key("2026-08-16"), key("2026-08-15"))).toHaveLength(0));
  it("length across a year", () =>
    expect(dayKeyRange(key("2026-01-01"), key("2026-12-31"))).toHaveLength(365));
  it("throws past maxDays", () =>
    expect(() =>
      dayKeyRange(key("2026-01-01"), key("2026-01-31"), { maxDays: 10 }),
    ).toThrow(RangeError));
});

describe("countdown", () => {
  const cdNow = new Date("2026-08-16T00:00:00.000Z");
  const cd = countdownTo(new Date("2026-08-18T03:04:05.000Z"), cdNow);

  it("countdown days", () => expect(cd.days).toBe(2));
  it("countdown hours", () => expect(cd.hours).toBe(3));
  it("countdown minutes", () => expect(cd.minutes).toBe(4));
  it("countdown seconds", () => expect(cd.seconds).toBe(5));
  it("countdown totalMinutes", () => expect(cd.totalMinutes).toBe(2 * 1440 + 3 * 60 + 4));
  it("exact zero", () => expect(countdownTo(cdNow, cdNow).totalSeconds).toBe(0));
  it("a passed deadline clamps to zero", () =>
    expect(countdownTo(new Date("2026-08-15T00:00:00.000Z"), cdNow).totalSeconds).toBe(0));
  it("clamped countdown reports zero days too", () =>
    expect(countdownTo(new Date("2026-08-01T00:00:00.000Z"), cdNow).days).toBe(0));
  it("minutesSince past", () =>
    expect(minutesSince(new Date("2026-08-15T23:00:00.000Z"), cdNow)).toBe(60));
  it("minutesSince future is negative", () =>
    expect(minutesSince(new Date("2026-08-16T01:00:00.000Z"), cdNow)).toBe(-60));
  it("minutesSince truncates", () =>
    expect(minutesSince(new Date("2026-08-15T23:59:30.000Z"), cdNow)).toBe(0));
});
