import { Prisma } from "@prisma/client";
import {
  resolvePackageBookingRule,
  TBookingDefaults,
  TPackageBookingRule,
  TPackageRuleColumns,
} from "@/lib/config/bookingConfig.types";

/**
 * Amenities moved from a bare `String[]` to `AmenityItem` rows so the admin can
 * reorder and hide individual bullets.
 *
 * Public reads keep exposing the old `{ description: string[] }` shape: every
 * consumer only ever renders the strings, so preserving the shape means the
 * card, the package page, the search results and the booking-link checkout all
 * keep working untouched — while hidden items are dropped and the admin's
 * ordering is honoured here, in one place, rather than in each of them.
 */
export const visibleAmenityItemsSelect = {
  items: {
    where: { isVisible: true },
    orderBy: { order: "asc" },
    select: { label: true },
  },
} satisfies Prisma.AmenitiesSelect;

/** The `amenities` select used by public package reads. */
export const publicAmenitiesSelect = {
  id: true,
  ...visibleAmenityItemsSelect,
} satisfies Prisma.AmenitiesSelect;

type AmenitiesWithItems = { items: { label: string }[] };

/**
 * Collapse `AmenityItem` rows back to the legacy `{ description }` shape.
 * Returns a new object; the `items` array is dropped so no caller can
 * accidentally read around the visibility filter.
 */
export function withAmenityDescriptions<T extends AmenitiesWithItems>(
  amenities: T,
): Omit<T, "items"> & { description: string[] } {
  const { items, ...rest } = amenities;
  return { ...rest, description: items.map((item) => item.label) };
}

/** Same, for a package row whose `amenities` relation was selected. */
export function withPackageAmenityDescriptions<
  T extends { amenities: AmenitiesWithItems },
>(
  pkg: T,
): Omit<T, "amenities"> & {
  amenities: Omit<T["amenities"], "items"> & { description: string[] };
} {
  return { ...pkg, amenities: withAmenityDescriptions(pkg.amenities) };
}

/** The rule columns every public package read selects. */
export const packageBookingRuleSelect = {
  minLeadTimeHours: true,
  minNewBookingCount: true,
  isBookableOnline: true,
} satisfies Prisma.PackageSelect;

/**
 * Attaches a `bookingRule` resolved against the site defaults, and strips the
 * raw override columns so nothing downstream can read around the inheritance.
 *
 * Doing this in the DTO means the rule travels with the package everywhere it
 * goes — page props, the search store, the booking form — instead of a separate
 * config object being threaded alongside and looked up by category.
 */
export function withPackageBookingRule<T extends TPackageRuleColumns>(
  pkg: T,
  defaults: TBookingDefaults,
): Omit<T, keyof TPackageRuleColumns> & {
  bookingRule: TPackageBookingRule;
} {
  const { minLeadTimeHours, minNewBookingCount, isBookableOnline, ...rest } =
    pkg;
  return {
    ...rest,
    bookingRule: resolvePackageBookingRule(
      { minLeadTimeHours, minNewBookingCount, isBookableOnline },
      defaults,
    ),
  };
}
