/**
 * The single entry point for every date and time decision in this app.
 *
 * The rule this file exists to enforce:
 *
 *   Store instants in UTC. Apply IST only at the display boundary.
 *
 * Cruise timings are an Asia/Kolkata business fact, but an instant is an
 * instant. Before this module the two were conflated: a sailing was stored as a
 * calendar-day column plus a `"09:00:AM"` string, and the actual departure
 * moment existed nowhere — it was recombined at every read, in ~130 places,
 * with host-timezone-dependent helpers. That is why the same day had two
 * different wire formats in one Redux store.
 *
 * Luxon is the only library used here. date-fns v3 has no timezone support
 * without `date-fns-tz` (not a dependency), so every one of its usages is
 * implicitly host-local — that *is* the bug class this replaces. moment is
 * deprecated and its strict `hh:mm:A` parse rejects the unpadded `"4:30:PM"`
 * that `PackageContentValidator` deliberately permits.
 *
 * IST has never observed DST and is a fixed +05:30, which is why a package's
 * departure can be stored as a wall-clock rule and resolved per date. Nothing
 * here assumes that, though — every conversion goes through Luxon's tzdata, so
 * it stays correct if that ever stops being true.
 */

import { DateTime } from "luxon";
import { z } from "zod";

export const IST_ZONE = "Asia/Kolkata" as const;

/** Rendered when a value cannot be formatted. Never let "Invalid DateTime"
 *  reach a customer's ticket. */
export const EMPTY_DISPLAY = "—" as const;

const MINUTES_PER_DAY = 1440;

/**
 * `YYYY-MM-DD` in IST — the one wire format for "which day".
 *
 * Branded deliberately. There are three mutually incompatible `Date`
 * representations of a calendar day in this codebase: browser-local midnight
 * (from react-day-picker), UTC midnight (from a `@db.Date` column), and a real
 * instant. They render identically in a debugger and differ by a day at the
 * edges. Making the key a nominal type means `tsc` finds every place a raw
 * string is being passed where a day key is meant, instead of a customer
 * finding it.
 */
export type IstDayKey = string & { readonly __brand: "IstDayKey" };

/**
 * Minutes from IST midnight. 0..1439 for a departure.
 *
 * An end time may legitimately exceed 1439: a cruise departing 22:00 and
 * returning 00:00 has an end of 1440, meaning midnight of the *following* IST
 * day. `istInstant` rolls that over correctly.
 */
export type IstMinutes = number & { readonly __brand: "IstMinutes" };

/**
 * Thrown when a `Date` that should always be valid is not.
 *
 * The day-key functions below take `Date` values that come from Prisma columns,
 * a date picker, or the clock — never from user text. An invalid one is a
 * programming error, so they throw rather than returning null: a nullable
 * return would force a `?? ""` or a non-null assertion at ~130 call sites, and
 * the overwhelmingly likely response to each would be to silence it. String
 * input, which genuinely can be malformed, goes through `parseIstDayKey` and
 * still returns null.
 */
export class InvalidDateError extends Error {
  constructor(fn: string, value: Date) {
    super(`${fn} received an invalid Date (${String(value)})`);
    this.name = "InvalidDateError";
  }
}

const DAY_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

/** The legacy stored time format: `H:MM:AM` — note the third segment is
 *  delimited by a colon, not a space, and the hour may be unpadded. */
const LEGACY_TIME_RE = /^(0?[1-9]|1[0-2]):([0-5][0-9]):(AM|PM)$/;

const pad2 = (n: number) => String(n).padStart(2, "0");

// ---------------------------------------------------------------------------
// Day keys
// ---------------------------------------------------------------------------

/**
 * The only place a raw string becomes an `IstDayKey`. Returns null rather than
 * throwing — callers decide what a bad day means. Rejects real-looking but
 * invalid dates such as `"2026-02-30"`.
 */
export function parseIstDayKey(value: string | null | undefined): IstDayKey | null {
  if (!value || !DAY_KEY_RE.test(value)) return null;
  const dt = DateTime.fromISO(value, { zone: IST_ZONE });
  if (!dt.isValid) return null;
  // fromISO is lenient about overflow in some builds; round-trip to be sure.
  return dt.toFormat("yyyy-MM-dd") === value ? (value as IstDayKey) : null;
}

/** For tRPC inputs, zod form schemas and search params. */
export const istDayKeySchema = z
  .string()
  .refine((v) => parseIstDayKey(v) !== null, {
    message: "Date must be a valid YYYY-MM-DD",
  })
  .transform((v) => v as IstDayKey);

/** Today in IST — never the host's today. The server runs UTC, so after 18:30
 *  UTC the host has already rolled into a day India has not reached. */
export function istToday(now: Date = new Date()): IstDayKey {
  return DateTime.fromJSDate(now, { zone: IST_ZONE }).toFormat(
    "yyyy-MM-dd",
  ) as IstDayKey;
}

/**
 * The IST calendar day a real instant falls on. Use for `createdAt`, `paidAt`,
 * `expiresAt`, `startsAt` — anything that is a moment in time.
 */
export function istDayKeyOf(instant: Date): IstDayKey {
  const dt = DateTime.fromJSDate(instant, { zone: IST_ZONE });
  if (!dt.isValid) throw new InvalidDateError("istDayKeyOf", instant);
  return dt.toFormat("yyyy-MM-dd") as IstDayKey;
}

/**
 * The day key for a Prisma `@db.Date` column value.
 *
 * Distinct from `istDayKeyOf` on purpose. A `@db.Date` is *already* a calendar
 * day; Prisma hydrates it as UTC midnight. Reading its UTC fields returns the
 * day that was stored. Passing it through a timezone conversion would be
 * treating a day as an instant — the exact confusion this module removes.
 */
export function dayKeyOfDateColumn(d: Date): IstDayKey {
  if (Number.isNaN(d.getTime())) {
    throw new InvalidDateError("dayKeyOfDateColumn", d);
  }
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(
    d.getUTCDate(),
  )}` as IstDayKey;
}

/** What Prisma wants back for a `@db.Date` column: UTC midnight, always. */
export function dayKeyToDateColumn(key: IstDayKey): Date {
  return new Date(`${key}T00:00:00.000Z`);
}

/**
 * The `Date` a react-day-picker calendar should select and highlight.
 *
 * Local midnight, because that is what the picker hands back from `onSelect`
 * and what it compares against internally. `new Date("2026-08-20")` would be
 * UTC midnight and highlight the wrong cell west of UTC.
 */
export function dayKeyToCalendarDate(key: IstDayKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Inverse of the above: what the user actually clicked becomes a day key. */
export function calendarDateToDayKey(d: Date): IstDayKey {
  if (Number.isNaN(d.getTime())) {
    throw new InvalidDateError("calendarDateToDayKey", d);
  }
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(
    d.getDate(),
  )}` as IstDayKey;
}

/** Chronological compare. Lexicographic ordering of `YYYY-MM-DD` is a valid
 *  date ordering, which is why day comparisons need no Date objects at all. */
export function compareDayKeys(a: IstDayKey, b: IstDayKey): -1 | 0 | 1 {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Month bounds as day keys.
 *
 * These replace `calendarDateToDayKey(startOfMonth(dayKeyString))`, which fed
 * a `YYYY-MM-DD` STRING into date-fns — parsed as UTC midnight, shifted to the
 * host zone, then reformatted in local time. Three representations for one
 * calendar operation. Month arithmetic on a day key needs no Date at all.
 */
export function startOfMonthKey(key: IstDayKey): IstDayKey {
  return `${key.slice(0, 7)}-01` as IstDayKey;
}

export function endOfMonthKey(key: IstDayKey): IstDayKey {
  return DateTime.fromISO(key, { zone: IST_ZONE })
    .endOf("month")
    .toFormat("yyyy-MM-dd") as IstDayKey;
}

export function addMonthsToKey(key: IstDayKey, months: number): IstDayKey {
  return DateTime.fromISO(key, { zone: IST_ZONE })
    .plus({ months })
    .toFormat("yyyy-MM-dd") as IstDayKey;
}

export function addDaysToKey(key: IstDayKey, days: number): IstDayKey {
  return DateTime.fromISO(key, { zone: IST_ZONE })
    .plus({ days })
    .toFormat("yyyy-MM-dd") as IstDayKey;
}

// ---------------------------------------------------------------------------
// Time of day
// ---------------------------------------------------------------------------

export function istMinutes(value: number): IstMinutes {
  return value as IstMinutes;
}

/**
 * Parses the legacy `"09:00:AM"` / `"4:30:PM"` format into minutes.
 *
 * Used ONLY by the backfill and by any remaining legacy read path; deleted once
 * the string columns are dropped. Mirrors the old `splitTimeColon` +
 * `convert12HourTo24Hour` pair, including the unpadded hour that
 * `PackageContentValidator` permits and that moment's strict `hh:mm:A` rejected
 * — the rejection that rendered those slots as a bare " - ".
 */
export function parseLegacyMeridiemTime(
  value: string | null | undefined,
): IstMinutes | null {
  if (!value) return null;
  const m = LEGACY_TIME_RE.exec(value);
  if (!m) return null;
  const hour12 = Number(m[1]);
  const minute = Number(m[2]);
  const isPm = m[3] === "PM";
  // 12:00 AM -> 0, 12:00 PM -> 720.
  const hour24 = (hour12 % 12) + (isPm ? 12 : 0);
  return (hour24 * 60 + minute) as IstMinutes;
}

/**
 * Minutes from IST midnight for a real instant — the inverse of `istInstant`
 * for same-day values. Used by the admin form to show a stored departure in a
 * `<input type="time">`.
 */
export function istMinutesOfInstant(instant: Date): IstMinutes {
  const dt = DateTime.fromJSDate(instant, { zone: IST_ZONE });
  if (!dt.isValid) throw new InvalidDateError("istMinutesOfInstant", instant);
  return (dt.hour * 60 + dt.minute) as IstMinutes;
}

/** `540` -> `"9:00 AM"`. Values past midnight wrap for display; use
 *  `formatIstRange` when the caller needs to show that it crossed. */
export function formatIstMinutes(minutes: IstMinutes | number): string {
  if (!Number.isFinite(minutes)) return EMPTY_DISPLAY;
  const wrapped = ((Math.trunc(minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h24 = Math.floor(wrapped / 60);
  const min = wrapped % 60;
  const meridiem = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${pad2(min)} ${meridiem}`;
}

/** `<input type="time">` value (`"09:00"`, always 24h) -> minutes. */
export function istMinutesFromInput(value: string | null | undefined): IstMinutes | null {
  if (!value) return null;
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!m) return null;
  return (Number(m[1]) * 60 + Number(m[2])) as IstMinutes;
}

/** minutes -> `<input type="time">` value. */
export function istMinutesToInput(minutes: IstMinutes | number): string {
  const wrapped = ((Math.trunc(minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  return `${pad2(Math.floor(wrapped / 60))}:${pad2(wrapped % 60)}`;
}

// ---------------------------------------------------------------------------
// Storing: IST wall clock -> UTC instant
// ---------------------------------------------------------------------------

/**
 * THE write-time resolver. (IST calendar day, IST minutes) -> absolute instant.
 *
 * Generalises the old `convertYYYMMDDStringAndTimeStringToUTCDate`: identical
 * Luxon semantics, but takes an already-parsed day and minute count instead of
 * splitting strings, so it cannot silently produce an Invalid Date.
 *
 * `minutes >= 1440` rolls into the following IST day. That is how a cruise
 * departing 22:00 and returning midnight stores its return.
 */
export function istInstant(day: IstDayKey, minutes: IstMinutes | number): Date {
  return DateTime.fromISO(day, { zone: IST_ZONE })
    .startOf("day")
    .plus({ minutes })
    .toJSDate();
}

/**
 * The `(startsAt, endsAt)` pair for one sailing — the single function every
 * writer calls, so a schedule's two instants can never be derived from
 * different rules.
 */
export function resolveSailingInstants(args: {
  day: IstDayKey;
  startMinutesIst: IstMinutes | number;
  durationMinutes: number;
}): { startsAt: Date; endsAt: Date } {
  const { day, startMinutesIst, durationMinutes } = args;
  return {
    startsAt: istInstant(day, startMinutesIst),
    endsAt: istInstant(day, Number(startMinutesIst) + durationMinutes),
  };
}

// ---------------------------------------------------------------------------
// Displaying: UTC instant -> IST string
// ---------------------------------------------------------------------------

export const IST_PATTERNS = {
  /** 9:00 AM */
  time: "h:mm a",
  /** 16-08-2026 */
  date: "dd-MM-yyyy",
  /** 16/08/2026 */
  dateSlash: "dd/MM/yyyy",
  /** Sun 16-08-2026 */
  dateWeekday: "ccc dd-MM-yyyy",
  /** 16 Aug 2026 */
  dateLong: "d LLL yyyy",
  /** Sunday 16 August 2026 */
  dateFull: "cccc d LLLL yyyy",
} as const;

export type IstPattern = keyof typeof IST_PATTERNS;

function inIst(instant: Date | null | undefined): DateTime | null {
  if (!instant || Number.isNaN(instant.getTime())) return null;
  const dt = DateTime.fromJSDate(instant, { zone: IST_ZONE });
  return dt.isValid ? dt : null;
}

export function formatIstTime(instant: Date | null | undefined): string {
  return inIst(instant)?.toFormat(IST_PATTERNS.time) ?? EMPTY_DISPLAY;
}

export function formatIstDate(
  instant: Date | null | undefined,
  pattern: IstPattern = "date",
): string {
  return inIst(instant)?.toFormat(IST_PATTERNS[pattern]) ?? EMPTY_DISPLAY;
}

/**
 * Always carries the zone suffix. These strings land in emails and tickets read
 * outside India, where an unqualified "9:00 AM" is a support ticket.
 */
export function formatIstDateTime(instant: Date | null | undefined): string {
  const dt = inIst(instant);
  return dt
    ? `${dt.toFormat(IST_PATTERNS.dateLong)}, ${dt.toFormat(IST_PATTERNS.time)} IST`
    : EMPTY_DISPLAY;
}

/** Formats a day key for display without pretending it is an instant. */
export function formatDayKey(
  key: IstDayKey | null | undefined,
  pattern: IstPattern = "date",
): string {
  if (!key) return EMPTY_DISPLAY;
  const dt = DateTime.fromISO(key, { zone: IST_ZONE });
  return dt.isValid ? dt.toFormat(IST_PATTERNS[pattern]) : EMPTY_DISPLAY;
}

/**
 * `"9:00 AM – 11:00 AM"`, or `"10:00 PM – 12:00 AM (+1)"` when the sailing
 * lands on the next IST day.
 *
 * Replaces every `{fromTime} - {toTime}` render site. Those sites could not
 * show the day roll at all, so an overnight cruise displayed as ending eight
 * hours before it began.
 */
export function formatIstRange(
  startsAt: Date | null | undefined,
  endsAt: Date | null | undefined,
): string {
  const s = inIst(startsAt);
  const e = inIst(endsAt);
  if (!s && !e) return EMPTY_DISPLAY;
  if (!s || !e) return `${formatIstTime(startsAt)} – ${formatIstTime(endsAt)}`;
  const crossed = e.startOf("day") > s.startOf("day");
  return `${s.toFormat(IST_PATTERNS.time)} – ${e.toFormat(IST_PATTERNS.time)}${
    crossed ? " (+1)" : ""
  }`;
}

// ---------------------------------------------------------------------------
// Booking window
// ---------------------------------------------------------------------------

/**
 * The two instants bounding a package's booking window: when the ship leaves,
 * and when we stop selling seats for it.
 *
 * Same contract as the previous `getBookingWindow`, minus the parsing. Once a
 * schedule carries `startsAt` this cannot fail, which removes the null branch
 * every caller had to handle — and the risk that a caller treated null as
 * "no restriction" rather than "no window".
 */
export function getBookingWindow(args: {
  departsAt: Date;
  minLeadTimeHours: number;
}): { departureAt: Date; closesAt: Date } {
  const { departsAt, minLeadTimeHours } = args;
  // Rounded because minLeadTimeHours is a Float: 0.5 and 1.25 are legal, and
  // `0.1 * 3_600_000` is not an integer number of milliseconds.
  const leadMs = Math.round(minLeadTimeHours * 60 * 60 * 1000);
  return {
    departureAt: departsAt,
    closesAt: new Date(departsAt.getTime() - leadMs),
  };
}

/** True while the departure is still far enough away to accept a booking. */
export function isWithinBookingWindow(args: {
  departsAt: Date;
  minLeadTimeHours: number;
  now?: Date;
}): boolean {
  const { departsAt, minLeadTimeHours, now = new Date() } = args;
  const { closesAt } = getBookingWindow({ departsAt, minLeadTimeHours });
  return closesAt.getTime() > now.getTime();
}
