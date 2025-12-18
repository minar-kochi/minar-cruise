/**
 * Date Utilities for Test Data
 * Handles date calculations and formatting for booking tests
 */

import { addDays, format } from 'date-fns';

/**
 * Date information structure containing various formats and components
 */
export interface DateInfo {
  date: Date;
  day: number;
  month: number;
  year: number;
  formatted: string;
  isoDate: string;
}

/**
 * Get future date information with multiple formats
 * @param daysAhead Number of days ahead from today
 * @returns DateInfo object with formatted dates and components
 */
export function getFutureDateInfo(daysAhead: number): DateInfo {
  const today = new Date();
  const futureDate = addDays(today, daysAhead);

  return {
    date: futureDate,
    day: futureDate.getDate(),
    month: futureDate.getMonth(),
    year: futureDate.getFullYear(),
    formatted: format(futureDate, 'dd/MM/yyyy'),
    isoDate: format(futureDate, 'yyyy-MM-dd'),
  };
}

/**
 * Parse date from ticket (dd/MM/yyyy format)
 * @param dateString Date string in dd/MM/yyyy format
 * @returns Parsed Date object
 */
export function parseDateFromTicket(dateString: string): Date {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}
