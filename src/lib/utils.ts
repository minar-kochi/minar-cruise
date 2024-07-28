import { TSplitedFormatedDate } from "@/Types/type";
import { type ClassValue, clsx } from "clsx";
import { formatISO, isValid } from "date-fns";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import { object } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isProd = process.env.NODE_ENV !== "development";

/**
 * @description sajdhasjdfjk hjsdb hjavdjhv asjhdv asfnhasvfhgv asfvshag v
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
    return `${process.env.DOMAIN as string}${path}`;
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
      ParsedInputDate.getDate()
    )
  );
  return formatISO(formatedDate);
}
/** Convert Date Object to YYYY-MM-DD format */
export function RemoveTimeStampFromDate(date: Date):string {
  return formatISO(date).split("T")[0];
}

export function ParseStringToNumber(x: string) {
  return isNaN(parseInt(x)) ? null : parseInt(x);
}

export function parseDateFormatYYYMMDDToNumber(
  date: string
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

export function isDateValid(date: TSplitedFormatedDate) {
  return moment([date.year, date.month - 1, date.day]).isValid();
}


export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
