import "server-only";
import { db } from "@/db";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";
import { computeBookingLinkQuote } from "@/lib/helpers/bookingLink/quote";
import { getBookingConfig } from "@/lib/helpers/config/getBookingConfig";
import { publicAmenitiesSelect } from "./amenities";
import { $Enums, Prisma } from "@prisma/client";

/**
 * The package fields the customer-facing /book/[token] page renders. Mirrors
 * the shape `getPackageById` selects, but keyed by id rather than slug.
 */
const linkPackageSelect = {
  id: true,
  title: true,
  description: true,
  packageType: true,
  packageCategory: true,
  duration: true,
  startMinutesIst: true,
  slug: true,
  amenities: { select: publicAmenitiesSelect },
  packageImage: {
    select: {
      image: {
        select: { url: true, alt: true, id: true },
      },
    },
  },
} satisfies Prisma.PackageSelect;

export type TBookingLinkByToken = Awaited<
  ReturnType<typeof getBookingLinkByToken>
>;

export async function getBookingLinkByToken(token: string) {
  try {
    return await db.bookingLink.findUnique({
      where: { token },
      include: {
        Package: { select: linkPackageSelect },
        schedule: {
          select: {
            id: true,
            day: true,
            scheduleStatus: true,
            startsAt: true,
            endsAt: true,
          },
        },
      },
    });
  } catch (error) {
    ErrorLogger(error);
    return null;
  }
}

/**
 * Read the pricing context the order.paid webhook needs to split a payment
 * into "collected now" vs "full booking value".
 *
 * Prefers the total that was persisted when the Razorpay order was created —
 * that is the number the customer actually saw. Falls back to recomputing from
 * the price snapshot when the stored quote belongs to a different order (e.g.
 * the customer abandoned one attempt and started another), which is why the
 * snapshot columns exist at all.
 *
 * Returns null when the link is unknown, so the caller can fall back to
 * treating the payment as an ordinary full-payment booking rather than failing
 * a webhook for money that has already been captured.
 */
export async function getBookingLinkForWebhook({
  bookingLinkId,
  razorpayOrderId,
  adultCount,
  childCount,
}: {
  bookingLinkId: string;
  razorpayOrderId: string;
  adultCount: number;
  childCount: number;
}): Promise<{ quotedTotalPaise: number; gstRate: number } | null> {
  try {
    const link = await db.bookingLink.findUnique({
      where: { id: bookingLinkId },
    });
    if (!link) return null;

    if (link.razorpayOrderId === razorpayOrderId && link.quotedTotalPaise) {
      return {
        quotedTotalPaise: link.quotedTotalPaise,
        gstRate: link.gstRate,
      };
    }

    /**
     * Razorpay has been known to return note values as strings, so coerce
     * before doing arithmetic with them.
     */
    const quote = computeBookingLinkQuote({
      adultPricePaise: link.adultPricePaise,
      childPricePaise: link.childPricePaise,
      gstRate: link.gstRate,
      adultCount: Number(adultCount) || 0,
      childCount: Number(childCount) || 0,
      paymentType: link.paymentType,
      advancePercent: link.advancePercent,
    });

    return { quotedTotalPaise: quote.fullTotalPaise, gstRate: link.gstRate };
  } catch (error) {
    ErrorLogger(error);
    return null;
  }
}

export type TSelectableScheduleRaw = Awaited<
  ReturnType<typeof getSelectableSchedulesForLink>
>["schedules"][number];

/**
 * What a client component receives. Identical to the server type: superjson
 * revives Dates as real Date objects, so no string substitution is needed.
 */
export type TSelectableSchedule = TSelectableScheduleRaw;

/**
 * Upcoming schedules an admin can issue a booking link against — the same list
 * they see under Manage Schedules, but carrying the package prices and the
 * seats already taken so the picker can show what is actually bookable.
 *
 * Only AVAILABLE schedules with a package attached: BLOCKED and EXCLUSIVE ones
 * are rejected at pay time, and a schedule with no package has no price to
 * snapshot.
 */
export async function getSelectableSchedulesForLink({
  cursor,
  limit = 20,
}: {
  cursor?: string | null;
  limit?: number | null;
}) {
  const take = limit ?? 20;

  const rows = await db.schedule.findMany({
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    where: {
      day: { gte: startOfToday() },
      scheduleStatus: "AVAILABLE",
      packageId: { not: null },
      Package: { packageCategory: { notIn: ["CUSTOM", "EXCLUSIVE"] } },
    },
    orderBy: [{ day: "asc" }, { startsAt: "asc" }],
    select: {
      id: true,
      day: true,
      startsAt: true,
      endsAt: true,
      schedulePackage: true,
      scheduleStatus: true,
      Package: {
        select: {
          id: true,
          title: true,
          packageType: true,
          packageCategory: true,
          adultPrice: true,
          childPrice: true,
          duration: true,
          startMinutesIst: true,
        },
      },
      Booking: { select: { totalBooking: true } },
    },
  });

  const hasMore = rows.length > take;
  const page = hasMore ? rows.slice(0, take) : rows;

  const { maxBoatSeat } = await getBookingConfig();
  const schedules = page.map(({ Booking, ...schedule }) => {
    const seatsBooked = Booking.reduce((sum, b) => sum + b.totalBooking, 0);
    return {
      ...schedule,
      seatsBooked,
      seatsLeft: Math.max(0, maxBoatSeat - seatsBooked),
    };
  });

  return {
    schedules,
    nextCursor: hasMore ? schedules[schedules.length - 1]?.id : undefined,
  };
}

/** Midnight today, so a schedule stays pickable for the rest of its own day. */
function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export type TBookingLinkListItem = Awaited<
  ReturnType<typeof listBookingLinks>
>["items"][number];

export async function listBookingLinks({
  cursor,
  limit = 20,
  status = "ALL",
}: {
  cursor?: string | null;
  limit?: number | null;
  status?: $Enums.BOOKING_LINK_STATUS | "ALL";
}) {
  const take = limit ?? 20;

  const rows = await db.bookingLink.findMany({
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    where: status === "ALL" ? undefined : { status },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      token: true,
      status: true,
      scheduleDay: true,
  scheduleStartsAt: true,
  scheduleEndsAt: true,
      paymentType: true,
      advancePercent: true,
      quotedTotalPaise: true,
      payableNowPaise: true,
      prefillName: true,
      prefillPhone: true,
      prefillEmail: true,
      expiresAt: true,
      bookingId: true,
      paidAt: true,
      createdAt: true,
      scheduleId: true,
      Package: { select: { title: true } },
    },
  });

  const hasMore = rows.length > take;
  const items = hasMore ? rows.slice(0, take) : rows;

  return {
    items,
    nextCursor: hasMore ? items[items.length - 1]?.id : undefined,
  };
}
