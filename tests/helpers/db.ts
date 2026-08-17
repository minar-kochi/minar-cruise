/**
 * Database lifecycle for the integration suite.
 *
 * The old `scripts/assert-booking-flows.ts` could not do this: it shared the dev
 * database with real data, so it tagged everything it created with the year 2099
 * and deleted it in a `finally`. A dedicated `minar_test` lets tests truncate
 * instead, which makes them order-independent and leak-proof — and incidentally
 * fixes `assert-payment-rounding`, whose leftover-rows check was red purely
 * because dev data was sitting in the table.
 */
import { db } from "@/db";

/**
 * Every table, in one statement. CASCADE handles the FK graph, so the order of
 * this list does not matter — but it must stay complete, or a stale row from one
 * file silently becomes another file's fixture.
 */
const TABLES = [
  "Events",
  "BookingLink",
  "Booking",
  "Payments",
  "User",
  "Schedule",
  "PackageSeo",
  "PackageImage",
  "Package",
  "AmenityItem",
  "Amenities",
  "FoodMenu",
  "BookingConfig",
  "TaxConfiguration",
] as const;

export async function truncateAll() {
  const list = TABLES.map((t) => `"${t}"`).join(", ");
  await db.$executeRawUnsafe(
    `TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE;`,
  );
}

export type Baseline = Awaited<ReturnType<typeof seedBaseline>>;

/**
 * The minimum a booking needs: one bookable package, plus the two config
 * singletons the server paths read through `getBookingConfig` / `getTaxConfig`.
 *
 * Prices are in PAISE and GST-exclusive, matching `Package.adultPrice`.
 * 9:00 AM IST departure, 240-minute sailing — the same shape as the real
 * breakfast cruise the assert scripts were written against.
 */
export async function seedBaseline(
  overrides: {
    startMinutesIst?: number;
    duration?: number;
    adultPrice?: number;
    childPrice?: number;
    minLeadTimeHours?: number | null;
    minNewBookingCount?: number | null;
    maxBoatSeat?: number;
    gstRate?: number;
    isBookableOnline?: boolean;
  } = {},
) {
  const amenities = await db.amenities.create({ data: {} });
  const food = await db.foodMenu.create({ data: { name: "Test menu" } });

  const pkg = await db.package.create({
    data: {
      title: "Test Breakfast Cruise",
      packageType: "Cruise",
      description: "A package that exists only for tests.",
      adultPrice: overrides.adultPrice ?? 100_000, // ₹1000 in paise
      childPrice: overrides.childPrice ?? 50_000, //  ₹500 in paise
      duration: overrides.duration ?? 240,
      startMinutesIst: overrides.startMinutesIst ?? 540, // 09:00 IST
      slug: "test-breakfast-cruise",
      packageCategory: "BREAKFAST",
      amenitiesId: amenities.id,
      foodMenuId: food.id,
      minLeadTimeHours: overrides.minLeadTimeHours ?? 2,
      minNewBookingCount: overrides.minNewBookingCount ?? 0,
      isBookableOnline: overrides.isBookableOnline ?? true,
    },
  });

  const bookingConfig = await db.bookingConfig.create({
    data: {
      id: "singleton",
      maxBoatSeat: overrides.maxBoatSeat ?? 150,
      defaultMinLeadTimeHours: 2,
      defaultMinNewBookingCount: 30,
    },
  });

  // gstRate is a PERCENTAGE, not a fraction: calculateGSTPaise does
  // `amount * (rate / 100)`, and the shipped fallback is GST_RATE = 5.0.
  const taxConfig = await db.taxConfiguration.create({
    data: {
      id: "singleton",
      gstRate: overrides.gstRate ?? 5,
      sacCode: "998555",
      gstin: "32TESTGSTIN1Z5",
    },
  });

  return { pkg, amenities, food, bookingConfig, taxConfig };
}

/** Truncate then re-seed. The usual `beforeEach`. */
export async function resetDb(
  overrides?: Parameters<typeof seedBaseline>[0],
): Promise<Baseline> {
  await truncateAll();
  return seedBaseline(overrides);
}
