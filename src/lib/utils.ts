import {
  calendarDateToDayKey,
  compareDayKeys,
  dayKeyOfDateColumn,
  dayKeyRange,
  dayKeyToDateColumn,
  istInstant,
  istToday,
  isSameMonthKey,
  isWithinBookingWindow,
  minutesSince,
  parseIstDayKey,
  type IstDayKey,
} from "@/lib/datetime";
import { TSplitedFormatedDate } from "@/Types/type";
import { $Enums } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TPackageBookingRule } from "@/lib/config/bookingConfig.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isProd = process.env.NODE_ENV !== "development";
export const isProduction = isProd ? "production" : "development";
/**
 * @example absoluteUrl('/api/get')
 *
 * @param path String thats Rest needed to combine with the Domain URL
 * @returns LocalHost:3002 || ProductionDomain+/path
 * @param @type
 *
 */
export function absoluteUrl(path: string): string {
  if (typeof window !== "undefined") return path;

  if (process.env.NODE_ENV === "production") {
    return `${process.env.NEXT_PUBLIC_DOMAIN as string}${path}`;
  } else {
    return `http://localhost:${process.env.PORT ?? 3002}${path}`;
  }
}

// const timestamp = 1721005820582;
export function getPrevTimeStamp(timestamp: number) {
  const date = new Date(timestamp);
  const oneDayBefore = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  const newTimestamp = oneDayBefore.getTime();
  return newTimestamp;
}

export function isSameDay(date: Date, fromDate: Date) {
  return (
    date.getDate() === fromDate.getDate() &&
    date.getMonth() === fromDate.getMonth() &&
    date.getFullYear() === fromDate.getFullYear()
  );
}

export function ParseStringToNumber(x: string) {
  return isNaN(parseInt(x)) ? null : parseInt(x);
}

export function parseDateFormatYYYMMDDToNumber(
  date: string,
): TSplitedFormatedDate | null {
  const splitValue = date.split("-");
  if (!splitValue || splitValue.length !== 3) return null;

  let validatedDate = {
    year: ParseStringToNumber(splitValue[0]),
    month: ParseStringToNumber(splitValue[1]),
    day: ParseStringToNumber(splitValue[2]),
  };

  if (
    validatedDate.year === null ||
    validatedDate.month === null ||
    validatedDate.day === null
  ) {
    return null;
  }

  return {
    year: validatedDate.year,
    day: validatedDate.day,
    month: validatedDate.month,
  };
}
type ParseDateFalsy = { date: null; parsedDate: null; error: true };
type ParseDateTruthy = {
  date: string;
  parsedDate: TSplitedFormatedDate;
  error: false;
};

export function parseSafeFormatYYYYMMDDToNumber(
  date: string,
): ParseDateTruthy | ParseDateFalsy {
  try {
    let parsedDate = parseDateFormatYYYMMDDToNumber(date);
    if (!parsedDate) {
      throw new Error("Invalid Date");
    }
    return { date: date, parsedDate, error: false };
  } catch (error) {
    return { date: null, parsedDate: null, error: true };
  }
}

/**
 * Is this year/month/day triple a real calendar date?
 *
 * Was `moment([year, month - 1, day]).isValid()` — the last real moment usage
 * in the app. Routed through `parseIstDayKey` instead so there is one date
 * validator rather than two that could disagree (and so that Feb 30 is rejected
 * by the same code path that rejects it everywhere else).
 */
export function isDateValid(date: TSplitedFormatedDate) {
  const key = `${String(date.year).padStart(4, "0")}-${String(
    date.month,
  ).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
  return parseIstDayKey(key) !== null;
}

export const sleep = (ms: number) => {
  if (isProd) return;
  return new Promise((r) => setTimeout(r, ms));
};

/**
 * Every @db.Date value from `fromDate` to `toDate`, inclusive.
 *
 * Was a date-fns loop doing LOCAL-field arithmetic on UTC-midnight Dates, which
 * can drift a day under a DST-observing host zone — and its output feeds
 * `createMany`, so a drift writes rows on the wrong days. Now it walks day keys
 * and converts back at the end, and `dayKeyRange` caps the span (the old loop
 * was unbounded).
 */
export function getDateRangeArray({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
}) {
  return dayKeyRange(
    dayKeyOfDateColumn(fromDate),
    dayKeyOfDateColumn(toDate),
  ).map(dayKeyToDateColumn);
}

/**
 *
 * @param clientDate send in YYYYMMDD format
 */
export const isCurrentMonthSameAsRequestedMonth = (clientDate: string) => {
  const day = parseIstDayKey(clientDate);
  // Was date-fns `isSameMonth(clientDateString, new Date())`, which parsed the
  // string as UTC midnight and compared it against the HOST's month.
  return day !== null && isSameMonthKey(day, istToday());
};

export function CapitalizeFirstLetterOfWord(value: string) {
  if (value.length < 1) return value;

  return `${value.charAt(0).toLocaleUpperCase()}${value.slice(1)}`;
}


/**
 * react-day-picker `disabled` predicate for the public booking calendar.
 *
 * Rewritten onto day keys and instants. It previously did
 * `new Date(d.toLocaleString("en-US", {timeZone:"Asia/Kolkata"}))` on both
 * sides — formatting to an IST string then re-parsing it as browser-local time,
 * three timezone hops relying on implementation-defined parsing — and compared
 * the results. The comparison happened to survive that because both sides were
 * shifted equally, but the greyed-out days were still off by one for anyone
 * west of UTC, because the available/blocked day arrays were formatted with a
 * host-local helper while the picker's date was not.
 */
export function filterDateFromCalender({
  date,
  dateArray,
  AvailableDate,
  startMinutesIst,
  rule,
}: {
  date: Date;
  dateArray: { day: Date }[] | undefined;
  AvailableDate: IstDayKey[] | undefined;
  /** The package's departure, minutes from IST midnight. */
  startMinutesIst: number;
  rule: TPackageBookingRule;
}) {
  const dayKey = calendarDateToDayKey(date);

  // Explicitly blocked by an admin.
  if (dateArray?.some((fv) => dayKeyOfDateColumn(fv.day) === dayKey)) {
    return true;
  }

  // Strictly before today in IST — never the host's today.
  if (compareDayKeys(dayKey, istToday()) < 0) return true;

  // Past this package's cut-off for that date.
  return !isWithinBookingWindow({
    departsAt: istInstant(dayKey, startMinutesIst),
    minLeadTimeHours: rule.minLeadTimeHours,
  });
}


export function flattenObject(obj: any, prefix = ""): Record<string, string> {
  if (obj === null || typeof obj === "undefined") {
    return { [prefix]: obj === null ? "null" : "undefined" };
  }

  if (typeof obj !== "object") {
    return { [prefix]: String(obj) };
  }

  return Object.keys(obj).reduce(
    (acc, key) => {
      const pre = prefix.length ? `${prefix}.` : "";
      const value = obj[key];

      if (value === null) {
        acc[pre + key] = "null";
      } else if (typeof value === "undefined") {
        acc[pre + key] = "undefined";
      } else if (typeof value === "object") {
        if (Array.isArray(value)) {
          // Handle arrays, including nested arrays and null/undefined elements
          value.forEach((item, index) => {
            const newKey = `${pre}${key}[${index}]`;
            if (item === null) {
              acc[newKey] = "null";
            } else if (typeof item === "undefined") {
              acc[newKey] = "undefined";
            } else if (typeof item === "object" && item !== null) {
              Object.assign(acc, flattenObject(item, newKey));
            } else {
              acc[newKey] = String(item);
            }
          });
        } else {
          // Recurse for nested objects
          Object.assign(acc, flattenObject(value, pre + key));
        }
      } else {
        // Handle primitive types
        acc[pre + key] = String(value);
      }

      return acc;
    },
    {} as Record<string, string>,
  );
}

export function formatPrice(price: number) {
  const RUPEE_DIVIDER = 100;
  return price / RUPEE_DIVIDER;
}

export const safeTotal = (value: number) => {
  const numberValue = Number(value);
  return isNaN(numberValue) ? 0 : numberValue;
};

/**
 * Truncates a string to a specified maximum length and appends an ellipsis ('...') if needed.
 *
 * @param {string} text - The string to be truncated.
 * @param {number} maxLength - The maximum allowed length of the string before truncation.
 * @returns {string} The truncated string, with an ellipsis if it was cut off.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

/**
 * Checks if the given date is older than the specified number of minutes.
 * @param dateString - ISO 8601 date string
 * @param minutesAgo - Threshold in minutes
 * @returns boolean
 */
export function isOlderThan(
  dateString: string | Date,
  minutesAgo: number,
): boolean {
  const date = new Date(dateString);
  return minutesSince(date) > minutesAgo;
}

/**
 * `combineDateAndTime` used to live here. It parsed `fromTime` with the Luxon
 * format "yyyy-MM-dd hh:mm:a", whose `hh` token demands a zero-padded hour —
 * so it returned an Invalid Date for the unpadded times the validator allows
 * and the seed already contains ("4:30:PM"), while `getBookingWindow` parsed
 * the very same string fine. Use `getBookingWindow` for anything that needs a
 * departure instant.
 */
