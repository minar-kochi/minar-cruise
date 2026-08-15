import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import {
  DEFAULT_MIN_LEAD_TIME_HOURS,
  MAX_BOAT_SEAT,
  MIN_NEW_BOOKING_COUNT,
} from "@/constants/config/business";
import { TBookingDefaults } from "@/lib/config/bookingConfig.types";

export const BOOKING_CONFIG_CACHE_TAG = "booking-config";
export const BOOKING_CONFIG_SINGLETON_ID = "singleton";

/**
 * The compile-time constants stay on as the fallback — same role
 * `lib/helpers/gst.ts` plays for the tax config. If the table is empty the site
 * keeps working on the values it shipped with.
 *
 * The per-cruise cutoffs (breakfast 16h, sunset 1h) now live on the packages
 * themselves, so only the shared default remains here.
 */
export const FALLBACK_BOOKING_DEFAULTS: TBookingDefaults = {
  maxBoatSeat: MAX_BOAT_SEAT,
  defaultMinLeadTimeHours: DEFAULT_MIN_LEAD_TIME_HOURS,
  defaultMinNewBookingCount: MIN_NEW_BOOKING_COUNT,
};

async function readBookingConfig(): Promise<TBookingDefaults> {
  const row = await db.bookingConfig.findUnique({
    where: { id: BOOKING_CONFIG_SINGLETON_ID },
    select: {
      maxBoatSeat: true,
      defaultMinLeadTimeHours: true,
      defaultMinNewBookingCount: true,
    },
  });
  return row ?? FALLBACK_BOOKING_DEFAULTS;
}

/** Cached read for public rendering. Busted by `revalidateBookingConfig()`. */
export const getBookingConfig = unstable_cache(
  readBookingConfig,
  ["booking-config"],
  { tags: [BOOKING_CONFIG_CACHE_TAG] },
);

/**
 * Uncached read for the admin editor. The form saves these values straight
 * back, so reading through the cache risks writing a stale value over a newer
 * one; an admin editing the defaults should see the real row.
 */
export const getBookingConfigUncached = readBookingConfig;
