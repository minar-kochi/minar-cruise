import { TPackageBookingRule } from "@/lib/config/bookingConfig.types";
import { getBookingWindow } from "@/lib/datetime";
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
 * Takes the departure as an instant rather than a (date, "6:30:AM") pair. The
 * previous version parsed that string here and fell back to the unclamped TTL
 * when parsing failed — which meant an unpadded or malformed `fromTime`
 * silently disabled the clamp and let a link stay payable up to departure. A
 * `Date` cannot fail to parse, so that failure mode no longer exists.
 */
export function resolveBookingLinkExpiry({
  departsAt,
  expiryHours,
  rule,
  now = new Date(),
}: {
  /** The sailing's departure instant — `Schedule.startsAt`. */
  departsAt: Date;
  expiryHours: number;
  /** The package's own resolved cut-off. */
  rule: TPackageBookingRule;
  now?: Date;
}): { expiresAt: Date; clampedToDeparture: boolean } {
  const ttlExpiry = new Date(now.getTime() + expiryHours * 60 * 60 * 1000);

  const { closesAt } = getBookingWindow({
    departsAt,
    minLeadTimeHours: rule.minLeadTimeHours,
  });

  if (closesAt < ttlExpiry) {
    return { expiresAt: closesAt, clampedToDeparture: true };
  }
  return { expiresAt: ttlExpiry, clampedToDeparture: false };
}

export function isBookingLinkExpired(
  expiresAt: Date,
  now: Date = new Date(),
): boolean {
  return expiresAt.getTime() <= now.getTime();
}
