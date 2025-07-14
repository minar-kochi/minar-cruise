// import { TTimeCycle } from "@/components/admin/dashboard/Schedule/ExclusiveScheduleTime";
import { TMeridianCycle, TSplitedFormatedDate, TTimeCycle } from "@/Types/type";
import { $Enums } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import {
  addDays,
  differenceInMinutes,
  formatISO,
  isBefore,
  isEqual,
  isSameMonth,
  startOfDay,
} from "date-fns";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import { DateTime } from "luxon";
import {
  isStatusBreakfast,
  isStatusDinner,
  isStatusLunch,
  isStatusSunset,
} from "./validators/Schedules";
import {
  MIN_BREAKFAST_BOOKING_HOUR,
  MIN_DINNER_BOOKING_HOUR,
  MIN_LUNCH_BOOKING_HOUR,
  MIN_SUNSET_BOOKING_HOUR,
} from "@/constants/config/business";

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
export function isSameDayString(date: string, fromDate: string) {
  return date === fromDate;
}
export function convertLocalDateToUTC(date: Date | string) {
  if (!date) {
    return date;
  }
  let formatedDate;
  let ParsedInputDate;
  ParsedInputDate = new Date(date);
  formatedDate = new Date(
    Date.UTC(
      ParsedInputDate.getFullYear(),
      ParsedInputDate.getMonth(),
      ParsedInputDate.getDate(),
    ),
  );
  return formatISO(formatedDate);
}
/** Convert Date Object to YYYY-MM-DD format */
export function RemoveTimeStampFromDate(date: Date): string {
  return formatISO(date).split("T")[0];
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

export function isDateValid(date: TSplitedFormatedDate) {
  return moment([date.year, date.month - 1, date.day]).isValid();
}

export const sleep = (ms: number) => {
  if (isProd) return;
  return new Promise((r) => setTimeout(r, ms));
};

export function getDateRangeArray({
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate: Date;
}) {
  const dates = [];

  // Ensure we're working with the start of each day
  const startDate = startOfDay(addDays(fromDate, 1));
  const endDate = startOfDay(addDays(toDate, 1));

  // Initialize current date as the start date
  let currentDate = startDate;

  // Keep adding dates until we reach or pass the end date
  while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return dates;
}

export const getUTCDate = (dateStr: string): number => {
  const date = new Date(dateStr);
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
  );
};

export function isTimeCycleMeridianValid(cycle: string): TMeridianCycle | null {
  if (cycle !== "AM" && cycle !== "PM") return null;
  return cycle;
}

export function splitTimeColon(value: string): TTimeCycle | null {
  if (!value) return null;
  const splited = value.split(":");
  if (splited.length !== 3) return null;
  let hours = splited[0];
  let min = splited[1];
  let Cycle = isTimeCycleMeridianValid(splited[2]);
  if (!Cycle || !hours || !min) return null;
  return {
    Cycle,
    hours,
    min,
  };
}
export function isTimeCycleValid(value: TTimeCycle): boolean {
  if (!value.Cycle || !value.hours.length || !value.min.length) return false;

  if (!isTimeCycleMeridianValid(value.Cycle)) return false;

  return true;
}
export function mergeTimeCycle(value: TTimeCycle): string | null {
  const { hours, min, Cycle } = value;
  return `${hours}:${min}:${Cycle}`;
}

export const isValidMergeTimeCycle = (timeString: string) => {
  return moment(timeString, "hh:mm:A", true).isValid();
};
export const mergedTime = (timeString: string) => {
  return moment(timeString, "hh:mm:A", true);
};
/**
 *
 * @param clientDate send in YYYYMMDD format
 */
export const isCurrentMonthSameAsRequestedMonth = (clientDate: string) => {
  return isSameMonth(clientDate, new Date(Date.now()));
};

export function CapitalizeFirstLetterOfWord(value: string) {
  if (value.length < 1) return value;

  return `${value.charAt(0).toLocaleUpperCase()}${value.slice(1)}`;
}

export function combineDateWithSplitedTime(date: Date, time: TTimeCycle) {
  let meridian = time.Cycle;
  let hours = parseInt(time.hours);
  let minutes = parseInt(time.min);
  if (meridian === "PM" && hours !== 12) {
    hours += 12;
  } else if (meridian === "AM" && hours === 12) {
    hours = 0;
  }
  const newDate = new Date(date);
  newDate.setMinutes(minutes);
  newDate.setHours(hours);
  newDate.setSeconds(0);
  return newDate;
}
export function getISTDateFromZ(date: Date) {
  return date.toLocaleDateString(undefined, {
    timeZone: "Asia/Kolkata",
  });
}
export function getISTDateAndTimeFromZ(date: Date) {
  return date.toLocaleString(undefined, {
    timeZone: "Asia/Kolkata",
  });
}

export function filterDateFromCalender({
  dateArray,
  date,
}: {
  date: Date;
  dateArray:
    | {
        day: Date;
      }[]
    | undefined;
}) {
  if (!dateArray) {
    return false;
  }

  // Check if the date exists in the dateArray
  let fi = dateArray.findIndex(
    (fv) => RemoveTimeStampFromDate(fv.day) === RemoveTimeStampFromDate(date),
  );

  if (fi !== -1) {
    return true;
  }

  // Get current date in Indian Standard Time (date only, no time)
  let currDate = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  );
  // Reset to start of day to avoid time comparison issues
  currDate.setHours(0, 0, 0, 0);

  // Convert the input date to IST for comparison (date only, no time)
  let dateInIST = new Date(
    date.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    }),
  );
  // Reset to start of day to avoid time comparison issues
  dateInIST.setHours(0, 0, 0, 0);

  // Only disable if the date is strictly before today
  if (dateInIST < currDate) {
    return true;
  }

  return false;
}

// return true if the schedule or bookings can be booked.
export function checkBookingTimeConstraint({
  scheduleTime,
  startFrom,
  selectedDate,
}: {
  scheduleTime: $Enums.SCHEDULED_TIME;
  startFrom: string;
  selectedDate: string;
}) {
  const UTCISTDATE = convertYYYMMDDStringAndTimeStringToUTCDate(
    selectedDate,
    startFrom,
  );

  if (!UTCISTDATE) {
    return false;
  }
  const timeGap = UTCISTDATE.LuxObj.diffNow("hour").hours;

  if (isStatusBreakfast(scheduleTime)) {
    return timeGap > MIN_BREAKFAST_BOOKING_HOUR;
  }
  if (isStatusLunch(scheduleTime)) {
    return timeGap > MIN_LUNCH_BOOKING_HOUR;
  }
  if (isStatusSunset(scheduleTime)) {
    return timeGap > MIN_SUNSET_BOOKING_HOUR;
  }
  if (isStatusDinner(scheduleTime)) {
    return timeGap > MIN_DINNER_BOOKING_HOUR;
  }
  return false;
}

export function convert12HourTo24Hour({
  hours: hour,
  min,
  Cycle,
}: TTimeCycle): { hour: number; minute: number } {
  let hourInt = parseInt(hour);
  let minInt = parseInt(min);

  if (Cycle === "AM" && hourInt === 12) {
    hourInt = 0; // Convert 12:00 AM to 00:00
  } else if (Cycle === "PM" && hourInt !== 12) {
    hourInt += 12; // Convert PM hour to 24-hour format, except for 12:00 PM
  }

  return { hour: hourInt, minute: minInt };
}

export function convertYYYMMDDStringAndTimeStringToUTCDate(
  dates: string,
  time: string,
) {
  try {
    const DateCycle = parseDateFormatYYYMMDDToNumber(dates);

    const timeCycle = splitTimeColon(time);
    if (!timeCycle || !DateCycle) {
      return null;
    }
    const TwentyFourHourFormat = convert12HourTo24Hour(timeCycle);
    let zo = DateTime.fromObject(
      {
        ...DateCycle,
        ...TwentyFourHourFormat,
      },
      { zone: "Asia/Kolkata" },
    );
    return {
      LuxObj: zo,
      parsedDate: zo.toJSDate(),
    };
  } catch (error) {
    return null;
  }
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
  return differenceInMinutes(new Date(), date) > minutesAgo;
}

export function combineDateAndTime(dateStr: string, timeStr: string): Date {
  const dt = DateTime.fromFormat(
    `${dateStr} ${timeStr}`,
    "yyyy-MM-dd hh:mm:a",
    {
      zone: "Asia/Kolkata",
    },
  );
  return dt.toJSDate(); // Convert Luxon DateTime to JS Date
}
