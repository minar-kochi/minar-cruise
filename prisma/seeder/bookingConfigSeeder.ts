import { PrismaClient } from "@prisma/client";

/**
 * Seeds the site-wide booking defaults with the values that used to live in
 * src/constants/config/business.ts, so a freshly pushed database behaves as the
 * hardcoded build did.
 *
 * Per-cruise cut-offs are NOT seeded here: they are per package now
 * (`Package.minLeadTimeHours` / `minNewBookingCount` / `isBookableOnline`), and
 * a package that leaves them null follows the defaults written below.
 *
 * Idempotent and non-destructive: only creates the row when missing, never
 * updates, so re-running cannot stomp an admin's edits.
 */
const db = new PrismaClient();

const MAX_BOAT_SEAT = 150;
const MIN_NEW_BOOKING_COUNT = 30;
/** Lunch/dinner's 2h was and is the common case; breakfast and sunset override. */
const DEFAULT_MIN_LEAD_TIME_HOURS = 2;

async function seedBookingConfig() {
  await db.$connect();

  const singleton = await db.bookingConfig.findUnique({
    where: { id: "singleton" },
    select: { id: true },
  });

  if (singleton) {
    console.log("BookingConfig already present — leaving it alone.");
  } else {
    await db.bookingConfig.create({
      data: {
        id: "singleton",
        maxBoatSeat: MAX_BOAT_SEAT,
        defaultMinLeadTimeHours: DEFAULT_MIN_LEAD_TIME_HOURS,
        defaultMinNewBookingCount: MIN_NEW_BOOKING_COUNT,
      },
    });
    console.log("BookingConfig singleton created.");
  }

  await db.$disconnect();
  process.exit(0);
}

seedBookingConfig().catch(async (error) => {
  console.error(error);
  await db.$disconnect();
  process.exit(1);
});
