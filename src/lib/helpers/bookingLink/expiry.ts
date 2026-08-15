import { TPackageBookingRule } from "@/lib/config/bookingConfig.types";
import { getBookingWindow } from "@/lib/utils";
import { $Enums } from "@prisma/client";

/**
 * When a booking link should stop working.
 *
 * `min(now + requested TTL, departure − lead time)`. The clamp is the point:
 * a 7-day TTL on tomorrow's breakfast cruise must die at that package's cutoff
 * — 16 hours before departure, as seeded — not in 7 days. It also closes a gap
 * in the existing flow —
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
  expiryHours,
  rule,
  now = new Date(),
}: {
  /** YYYY-MM-DD */
  scheduleDate: string;
  /** Package.fromTime — colon-delimited meridiem, e.g. "6:30:AM" */
  departureTime: string;
  expiryHours: number;
  /** The package's own resolved cut-off. */
  rule: TPackageBookingRule;
  now?: Date;
}): { expiresAt: Date; clampedToDeparture: boolean } {
  const ttlExpiry = new Date(now.getTime() + expiryHours * 60 * 60 * 1000);

  const window = getBookingWindow({
    selectedDate: scheduleDate,
    startFrom: departureTime,
    rule,
  });
  if (!window) return { expiresAt: ttlExpiry, clampedToDeparture: false };

  if (window.closesAt < ttlExpiry) {
    return { expiresAt: window.closesAt, clampedToDeparture: true };
  }
  return { expiresAt: ttlExpiry, clampedToDeparture: false };
}

export function isBookingLinkExpired(
  expiresAt: Date,
  now: Date = new Date(),
): boolean {
  return expiresAt.getTime() <= now.getTime();
}
