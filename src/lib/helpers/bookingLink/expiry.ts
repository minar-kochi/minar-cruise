import {
  MIN_BREAKFAST_BOOKING_HOUR,
  MIN_DINNER_BOOKING_HOUR,
  MIN_LUNCH_BOOKING_HOUR,
  MIN_SUNSET_BOOKING_HOUR,
} from "@/constants/config/business";
import { convertYYYMMDDStringAndTimeStringToUTCDate } from "@/lib/utils";
import { $Enums } from "@prisma/client";

/**
 * Operational cut-off for a slot: how many hours before departure the galley
 * and crew stop accepting new covers. Same numbers `checkBookingTimeConstraint`
 * enforces for the public flow.
 */
export function leadTimeHoursFor(scheduleTime: $Enums.SCHEDULED_TIME): number {
  switch (scheduleTime) {
    case "BREAKFAST":
      return MIN_BREAKFAST_BOOKING_HOUR;
    case "LUNCH":
      return MIN_LUNCH_BOOKING_HOUR;
    case "SUNSET":
      return MIN_SUNSET_BOOKING_HOUR;
    case "DINNER":
      return MIN_DINNER_BOOKING_HOUR;
    default:
      return MIN_LUNCH_BOOKING_HOUR;
  }
}

/**
 * When a booking link should stop working.
 *
 * `min(now + requested TTL, departure − lead time)`. The clamp is the point:
 * a 7-day TTL on tomorrow's breakfast cruise must die 16 hours before
 * departure, not in 7 days. It also closes a gap in the existing flow —
 * `schedule.existing` orders have no lead-time gate at all today, so without
 * this a link could be paid ten minutes before the boat leaves.
 *
 * Falls back to the plain TTL when the departure time cannot be parsed, so a
 * malformed `fromTime` degrades to "expires normally" rather than "expired the
 * moment it was created".
 */
export function resolveBookingLinkExpiry({
  scheduleDate,
  departureTime,
  scheduleTime,
  expiryHours,
  now = new Date(),
}: {
  /** YYYY-MM-DD */
  scheduleDate: string;
  /** Package.fromTime, e.g. "6:30 AM" */
  departureTime: string;
  scheduleTime: $Enums.SCHEDULED_TIME;
  expiryHours: number;
  now?: Date;
}): { expiresAt: Date; clampedToDeparture: boolean } {
  const ttlExpiry = new Date(now.getTime() + expiryHours * 60 * 60 * 1000);

  const departure = convertYYYMMDDStringAndTimeStringToUTCDate(
    scheduleDate,
    departureTime,
  );
  if (!departure) return { expiresAt: ttlExpiry, clampedToDeparture: false };

  const cutoff = new Date(
    departure.parsedDate.getTime() -
      leadTimeHoursFor(scheduleTime) * 60 * 60 * 1000,
  );

  if (cutoff < ttlExpiry) {
    return { expiresAt: cutoff, clampedToDeparture: true };
  }
  return { expiresAt: ttlExpiry, clampedToDeparture: false };
}

export function isBookingLinkExpired(
  expiresAt: Date,
  now: Date = new Date(),
): boolean {
  return expiresAt.getTime() <= now.getTime();
}
