/**
 * Assertions for src/lib/datetime.ts.
 *
 * The repo has no test runner, so this is a plain tsx script:
 *   docker exec --user node -w /workspace/minar-cruise minar-dev \
 *     npx tsx scripts/assert-datetime.ts
 *
 * THE POINT OF THIS FILE: every assertion below must hold identically no matter
 * what TZ the process runs under. That is the whole claim being made — that
 * date handling no longer depends on the host's timezone. So run it three ways
 * and diff the output:
 *
 *   for TZ in UTC America/Los_Angeles Pacific/Kiritimati Asia/Kolkata; do
 *     docker exec --user node -w /workspace/minar-cruise -e TZ=$TZ minar-dev \
 *       npx tsx scripts/assert-datetime.ts
 *   done
 *
 * America/Los_Angeles (UTC-7/8) and Pacific/Kiritimati (UTC+14) bracket the
 * real world: if a day key is going to slip, it slips at one of those two.
 */
import {
  addDaysToKey,
  calendarDateToDayKey,
  compareDayKeys,
  dayKeyOfDateColumn,
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
  istToday,
  isWithinBookingWindow,
  parseIstDayKey,
  parseLegacyMeridiemTime,
  resolveSailingInstants,
  type IstDayKey,
} from "../src/lib/datetime";

let failures = 0;
const key = (s: string) => s as IstDayKey;

function check(label: string, actual: unknown, expected: unknown) {
  const a = actual instanceof Date ? actual.toISOString() : actual;
  const e = expected instanceof Date ? expected.toISOString() : expected;
  const ok = a === e;
  if (!ok) failures++;
  console.log(
    `${ok ? "  ok  " : " FAIL "} ${label}${ok ? "" : ` — expected ${e}, got ${a}`}`,
  );
}

console.log(`\nTZ=${process.env.TZ ?? "(unset)"}  host offset=${-new Date().getTimezoneOffset()}min`);

// ---------------------------------------------------------------------------
console.log("\nparseLegacyMeridiemTime — the three-colon format");
check("09:00:AM", parseLegacyMeridiemTime("09:00:AM"), 540);
check("12:00:AM is midnight, not noon", parseLegacyMeridiemTime("12:00:AM"), 0);
check("12:00:PM is noon", parseLegacyMeridiemTime("12:00:PM"), 720);
check("05:30:PM", parseLegacyMeridiemTime("05:30:PM"), 1050);
// The unpadded hour the validator permits and moment's strict hh:mm:A rejected.
check("4:30:PM (unpadded)", parseLegacyMeridiemTime("4:30:PM"), 990);
check("11:59:PM", parseLegacyMeridiemTime("11:59:PM"), 1439);
check("rejects 13:00:PM", parseLegacyMeridiemTime("13:00:PM"), null);
check("rejects 09:00 AM (space)", parseLegacyMeridiemTime("09:00 AM"), null);
check("rejects 09:60:AM", parseLegacyMeridiemTime("09:60:AM"), null);
check("rejects empty", parseLegacyMeridiemTime(""), null);
check("rejects null", parseLegacyMeridiemTime(null), null);

// ---------------------------------------------------------------------------
console.log("\nistInstant — IST wall clock to UTC instant (IST is +05:30)");
check(
  "2026-08-16 09:00 IST -> 03:30Z",
  istInstant(key("2026-08-16"), 540),
  new Date("2026-08-16T03:30:00.000Z"),
);
check(
  "2026-08-16 00:00 IST -> previous 18:30Z",
  istInstant(key("2026-08-16"), 0),
  new Date("2026-08-15T18:30:00.000Z"),
);
check(
  "2025-11-23 22:00 IST -> 16:30Z",
  istInstant(key("2025-11-23"), 1320),
  new Date("2025-11-23T16:30:00.000Z"),
);
// The midnight-crossing case: 1440 minutes is 00:00 of the FOLLOWING IST day.
// This is the production row 2025-11-23 "10:00:PM" -> "12:00:AM".
check(
  "2025-11-23 + 1440min -> 2025-11-24 00:00 IST",
  istInstant(key("2025-11-23"), 1440),
  new Date("2025-11-23T18:30:00.000Z"),
);
check(
  "and that instant reads back as the 24th in IST",
  istDayKeyOf(istInstant(key("2025-11-23"), 1440)),
  "2025-11-24",
);

// ---------------------------------------------------------------------------
console.log("\nresolveSailingInstants");
const sail = resolveSailingInstants({
  day: key("2026-08-16"),
  startMinutesIst: 540,
  durationMinutes: 120,
});
check("breakfast starts 03:30Z", sail.startsAt, new Date("2026-08-16T03:30:00.000Z"));
check("breakfast ends 05:30Z", sail.endsAt, new Date("2026-08-16T05:30:00.000Z"));

const overnight = resolveSailingInstants({
  day: key("2025-11-23"),
  startMinutesIst: 1320, // 22:00
  durationMinutes: 120, // -> 00:00 next day
});
check("overnight ends next IST day", istDayKeyOf(overnight.endsAt), "2025-11-24");
check("overnight endsAt > startsAt", overnight.endsAt > overnight.startsAt, true);

// ---------------------------------------------------------------------------
console.log("\ndayKeyOfDateColumn — @db.Date hydrates as UTC midnight");
// MUST be host-TZ independent. This is what RemoveTimeStampFromDate got wrong:
// formatISO() rendered in local time, so west of UTC it returned the day before.
check(
  "UTC midnight reads as its own day",
  dayKeyOfDateColumn(new Date("2026-08-16T00:00:00.000Z")),
  "2026-08-16",
);
check(
  "Jan 1 does not slip to Dec 31",
  dayKeyOfDateColumn(new Date("2026-01-01T00:00:00.000Z")),
  "2026-01-01",
);
check(
  "Dec 31 does not slip to Jan 1",
  dayKeyOfDateColumn(new Date("2025-12-31T00:00:00.000Z")),
  "2025-12-31",
);
check("round-trips through dayKeyToDateColumn",
  dayKeyOfDateColumn(dayKeyToDateColumn(key("2026-08-16"))), "2026-08-16");
check("dayKeyToDateColumn is UTC midnight",
  dayKeyToDateColumn(key("2026-08-16")), new Date("2026-08-16T00:00:00.000Z"));

// ---------------------------------------------------------------------------
console.log("\nistDayKeyOf — the IST midnight boundary (18:30Z)");
check(
  "18:29Z is still the same IST day",
  istDayKeyOf(new Date("2026-08-16T18:29:59.000Z")),
  "2026-08-16",
);
check(
  "18:30Z has rolled into the next IST day",
  istDayKeyOf(new Date("2026-08-16T18:30:00.000Z")),
  "2026-08-17",
);
// This is the bug behind "upcoming schedules" being wrong for 5.5h every night.
check(
  "istToday at 19:00Z is tomorrow in India",
  istToday(new Date("2026-08-16T19:00:00.000Z")),
  "2026-08-17",
);
check(
  "istToday at 12:00Z is still today in India",
  istToday(new Date("2026-08-16T12:00:00.000Z")),
  "2026-08-16",
);

// ---------------------------------------------------------------------------
console.log("\ncalendarDateToDayKey / dayKeyToCalendarDate — local midnight");
// react-day-picker hands back local midnight; these two must round-trip in
// whatever zone the browser is in.
const picked = dayKeyToCalendarDate(key("2026-08-16"));
check("calendar Date is local midnight", picked.getHours(), 0);
check("round-trips", calendarDateToDayKey(picked), "2026-08-16");
check(
  "round-trips across a year boundary",
  calendarDateToDayKey(dayKeyToCalendarDate(key("2026-01-01"))),
  "2026-01-01",
);

// ---------------------------------------------------------------------------
console.log("\nparseIstDayKey / istDayKeySchema");
check("accepts a real date", parseIstDayKey("2026-08-16"), "2026-08-16");
check("rejects Feb 30", parseIstDayKey("2026-02-30"), null);
check("accepts a leap day", parseIstDayKey("2024-02-29"), "2024-02-29");
check("rejects a non-leap Feb 29", parseIstDayKey("2026-02-29"), null);
check("rejects an ISO instant", parseIstDayKey("2026-08-16T00:00:00Z"), null);
check("rejects a slash format", parseIstDayKey("16/08/2026"), null);
check("rejects empty", parseIstDayKey(""), null);
check("zod schema accepts", istDayKeySchema.safeParse("2026-08-16").success, true);
check("zod schema rejects", istDayKeySchema.safeParse("2026-02-30").success, false);

// ---------------------------------------------------------------------------
console.log("\nday key arithmetic and ordering");
check("addDays across a month end", addDaysToKey(key("2026-08-31"), 1), "2026-09-01");
check("addDays across a year end", addDaysToKey(key("2025-12-31"), 1), "2026-01-01");
check("addDays negative", addDaysToKey(key("2026-01-01"), -1), "2025-12-31");
check("compare earlier", compareDayKeys(key("2026-08-15"), key("2026-08-16")), -1);
check("compare equal", compareDayKeys(key("2026-08-16"), key("2026-08-16")), 0);
check("compare later", compareDayKeys(key("2026-08-17"), key("2026-08-16")), 1);

// ---------------------------------------------------------------------------
console.log("\ntime-of-day formatting");
check("540 -> 9:00 AM", formatIstMinutes(540), "9:00 AM");
check("0 -> 12:00 AM", formatIstMinutes(0), "12:00 AM");
check("720 -> 12:00 PM", formatIstMinutes(720), "12:00 PM");
check("1050 -> 5:30 PM", formatIstMinutes(1050), "5:30 PM");
check("1439 -> 11:59 PM", formatIstMinutes(1439), "11:59 PM");
check("1440 wraps to 12:00 AM", formatIstMinutes(1440), "12:00 AM");
check("input round-trip 09:00", istMinutesToInput(istMinutesFromInput("09:00")!), "09:00");
check("input round-trip 17:30", istMinutesToInput(istMinutesFromInput("17:30")!), "17:30");
check("istMinutesFromInput('17:30')", istMinutesFromInput("17:30"), 1050);
check("rejects 24:00", istMinutesFromInput("24:00"), null);
check("rejects 9:00 (unpadded)", istMinutesFromInput("9:00"), null);

// ---------------------------------------------------------------------------
console.log("\ninstant formatting — always IST regardless of host TZ");
const noon = new Date("2026-08-16T03:30:00.000Z"); // 09:00 IST
check("formatIstTime", formatIstTime(noon), "9:00 AM");
check("formatIstDate", formatIstDate(noon), "16-08-2026");
check("formatIstDate slash", formatIstDate(noon, "dateSlash"), "16/08/2026");
check("formatIstDate long", formatIstDate(noon, "dateLong"), "16 Aug 2026");
check("formatIstDateTime carries IST", formatIstDateTime(noon), "16 Aug 2026, 9:00 AM IST");
// An instant that is a different calendar day in UTC than in IST.
const lateIst = new Date("2026-08-16T19:00:00.000Z"); // 00:30 IST on the 17th
check("late-evening UTC renders as next IST day", formatIstDate(lateIst), "17-08-2026");
check("formatDayKey", formatDayKey(key("2026-08-16"), "dateLong"), "16 Aug 2026");

console.log("\ninvalid input never leaks 'Invalid DateTime'");
check("formatIstTime(null)", formatIstTime(null), "—");
check("formatIstDate(undefined)", formatIstDate(undefined), "—");
check("formatIstDateTime(bad Date)", formatIstDateTime(new Date("nope")), "—");
check("formatIstRange(null,null)", formatIstRange(null, null), "—");
check("dayKeyOfDateColumn(bad Date)", dayKeyOfDateColumn(new Date("nope")), null);

// ---------------------------------------------------------------------------
console.log("\nformatIstRange — the (+1) that the old {fromTime}-{toTime} could not show");
check(
  "same-day range",
  formatIstRange(
    istInstant(key("2026-08-16"), 540),
    istInstant(key("2026-08-16"), 660),
  ),
  "9:00 AM – 11:00 AM",
);
check(
  "midnight crossing is marked",
  formatIstRange(
    istInstant(key("2025-11-23"), 1320),
    istInstant(key("2025-11-23"), 1440),
  ),
  "10:00 PM – 12:00 AM (+1)",
);

// ---------------------------------------------------------------------------
console.log("\nbooking window");
const departs = new Date("2026-08-16T03:30:00.000Z");
check(
  "2h lead closes 2h earlier",
  getBookingWindow({ departsAt: departs, minLeadTimeHours: 2 }).closesAt,
  new Date("2026-08-16T01:30:00.000Z"),
);
check(
  "fractional lead is rounded to whole ms",
  getBookingWindow({ departsAt: departs, minLeadTimeHours: 0.1 }).closesAt,
  new Date("2026-08-16T03:24:00.000Z"),
);
check(
  "16h breakfast lead reaches the previous evening",
  getBookingWindow({ departsAt: departs, minLeadTimeHours: 16 }).closesAt,
  new Date("2026-08-15T11:30:00.000Z"),
);
check(
  "zero lead means departure is the cutoff",
  getBookingWindow({ departsAt: departs, minLeadTimeHours: 0 }).closesAt,
  departs,
);
check(
  "open well before",
  isWithinBookingWindow({
    departsAt: departs,
    minLeadTimeHours: 2,
    now: new Date("2026-08-16T00:00:00.000Z"),
  }),
  true,
);
check(
  "closed inside the lead time",
  isWithinBookingWindow({
    departsAt: departs,
    minLeadTimeHours: 2,
    now: new Date("2026-08-16T02:00:00.000Z"),
  }),
  false,
);
check(
  "closed after it sailed",
  isWithinBookingWindow({
    departsAt: departs,
    minLeadTimeHours: 2,
    now: new Date("2026-08-16T09:00:00.000Z"),
  }),
  false,
);

// ---------------------------------------------------------------------------
console.log(
  failures === 0
    ? "\nAll datetime assertions passed.\n"
    : `\n${failures} assertion(s) FAILED.\n`,
);
process.exit(failures === 0 ? 0 : 1);
