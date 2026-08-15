/**
 * FALLBACKS ONLY — these are no longer the source of truth.
 *
 * Booking limits now live in two places:
 *   - `BookingConfig`, a singleton of site-wide defaults, edited at
 *     /admin/settings/booking; and
 *   - columns on each `Package` (`minLeadTimeHours`, `minNewBookingCount`,
 *     `isBookableOnline`), edited on that package's Settings tab, which
 *     override the defaults when set.
 *
 * `lib/helpers/config/getBookingConfig.ts` reads the defaults and falls back to
 * the values here when the row is missing — the same way `lib/helpers/gst.ts`
 * backs the tax config.
 *
 * Changing a number here will NOT change site behaviour on a seeded database.
 */
export const MAX_BOAT_SEAT = 150;

/**
 * The cut-off a package inherits unless it sets its own. Was
 * `MIN_LUNCH_BOOKING_HOUR` back when every cruise time had its own constant.
 *
 * Breakfast's 16h and sunset's 1h are per-package overrides now, written by
 * `prisma/data/dbPackage.ts` on a fresh seed and by
 * `prisma/seeder/backfillPackageConfig.ts` on an existing database. A package
 * that has neither run against it inherits the 2 hours below, which is wrong
 * for both of them — so the backfill is not optional on deploy.
 */
export const DEFAULT_MIN_LEAD_TIME_HOURS = 2;

export const MIN_NEW_BOOKING_COUNT = 30;
