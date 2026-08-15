/**
 * Booking rules as they cross the server -> client boundary.
 *
 * This module deliberately has no `server-only` import: the booking calendar and
 * the countdown badge are client components, and they receive this object as a
 * prop. Keep it a plain serialisable object — no Dates, no class instances.
 */

/** The site-wide defaults a package falls back to. */
export type TBookingDefaults = {
  maxBoatSeat: number;
  defaultMinLeadTimeHours: number;
  defaultMinNewBookingCount: number;
};

/**
 * One package's rules, already resolved against the defaults. Every consumer
 * receives this rather than a config plus a category to look itself up with —
 * resolution happens once, on the server, where the package row is in hand.
 */
export type TPackageBookingRule = {
  /** Hours before departure after which new bookings stop being accepted. */
  minLeadTimeHours: number;
  /** Minimum seats to open a brand-new schedule, or `null` for no minimum. */
  minNewBookingCount: number | null;
  /** When false the package takes enquiries rather than online bookings. */
  isBookableOnline: boolean;
  /** Carried along so components needing capacity don't need a second prop. */
  maxBoatSeat: number;
};

/** The three columns a package stores. See the schema for the sentinels. */
export type TPackageRuleColumns = {
  minLeadTimeHours: number | null;
  minNewBookingCount: number | null;
  isBookableOnline: boolean;
};

/**
 * Applies the defaults to a package's overrides.
 *
 * The `minNewBookingCount` encoding is the one thing worth reading twice:
 * `null` means "follow the default", `0` means "no minimum at all", and any
 * other number is that exact minimum. Using 0 rather than a second boolean
 * column keeps the three states in one field; `null` on the way out means
 * no minimum, so callers must skip the check rather than fall back.
 */
export function resolvePackageBookingRule(
  pkg: TPackageRuleColumns,
  defaults: TBookingDefaults,
): TPackageBookingRule {
  return {
    minLeadTimeHours: pkg.minLeadTimeHours ?? defaults.defaultMinLeadTimeHours,
    minNewBookingCount:
      pkg.minNewBookingCount === null
        ? defaults.defaultMinNewBookingCount
        : pkg.minNewBookingCount === 0
          ? null
          : pkg.minNewBookingCount,
    isBookableOnline: pkg.isBookableOnline,
    maxBoatSeat: defaults.maxBoatSeat,
  };
}
