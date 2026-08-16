import { db } from "@/db";
import { getBookingLinkByToken } from "@/db/data/dto/bookingLink";
import { totalBookedSeats } from "@/db/data/dto/booking";
import { isBookingLinkExpired } from "@/lib/helpers/bookingLink/expiry";
import { getBookingConfig } from "@/lib/helpers/config/getBookingConfig";
import {
  computeBookingLinkQuote,
  MIN_ORDER_PAISE,
} from "@/lib/helpers/bookingLink/quote";
import { verifyRecaptcha } from "@/lib/helpers/recaptcha";
import { resolveScheduleForPackageDate } from "@/lib/helpers/resolveScheduleForPackageDate";
import {
  bookingLinkCheckoutSchema,
  bookingLinkTokenSchema,
} from "@/lib/validators/bookingLink";
import { publicProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { CreateBookingForCreateSchedule } from "./userBookingCreateScheduleTRPC";
import { CreateBookingForExistingSchedule } from "./userBookingExistingScheduleTRPC";

/**
 * Reject a link that is no longer usable, with a message the customer can act
 * on. Called both when the page loads and again immediately before creating the
 * order, because the page's data is stale by the time they press pay.
 */
function assertLinkUsable(link: {
  status: string;
  expiresAt: Date;
  bookingId: string | null;
}) {
  if (link.status === "CANCELLED") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        "This booking link has been cancelled. Please contact us for a new one.",
    });
  }
  if (link.status === "PAID" || link.bookingId) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "This booking has already been paid for.",
    });
  }
  if (link.status === "EXPIRED" || isBookingLinkExpired(link.expiresAt)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message:
        "This booking link has expired. Please contact us for a new one.",
    });
  }
}

export const bookingLink = router({
  /**
   * Everything the /book/[token] page renders — and nothing more. The link is
   * a public URL, so this deliberately omits the admin note, who created it,
   * and the internal ids.
   */
  getByToken: publicProcedure
    .input(bookingLinkTokenSchema)
    .query(async ({ input: { token } }) => {
      const link = await getBookingLinkByToken(token);

      if (!link) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This booking link is not valid.",
        });
      }

      assertLinkUsable(link);

      const seatsBooked = link.scheduleId
        ? await totalBookedSeats(link.scheduleId)
        : 0;

      return {
        token: link.token,
        scheduleDay: link.scheduleDay,
        // The departure frozen at generation time. The checkout page renders
        // this, not the live package, so an admin editing the package cannot
        // change what an already-sent link says.
        scheduleStartsAt: link.scheduleStartsAt,
        scheduleEndsAt: link.scheduleEndsAt,
        paymentType: link.paymentType,
        advancePercent: link.advancePercent,
        adultPricePaise: link.adultPricePaise,
        childPricePaise: link.childPricePaise,
        gstRate: link.gstRate,
        expiresAt: link.expiresAt,
        /** -1 means the count could not be read; treat as unknown, not full. */
        seatsLeft:
          seatsBooked < 0
            ? null
            : Math.max(0, (await getBookingConfig()).maxBoatSeat - seatsBooked),
        package: {
          title: link.Package.title,
          description: link.Package.description,
          packageType: link.Package.packageType,
          duration: link.Package.duration,
          amenities:
            link.Package.amenities?.items.map((item) => item.label) ?? [],
          imageUrl: link.Package.packageImage[0]?.image.url ?? null,
          imageAlt:
            link.Package.packageImage[0]?.image.alt ?? link.Package.title,
        },
        prefill: {
          name: link.prefillName ?? "",
          email: link.prefillEmail ?? "",
          phone: link.prefillPhone ?? "",
          adultCount: link.prefillAdultCount,
          childCount: link.prefillChildCount,
          babyCount: link.prefillBabyCount,
        },
      };
    }),

  createOrder: publicProcedure
    .input(bookingLinkCheckoutSchema)
    .mutation(async ({ input }) => {
      await verifyRecaptcha(input.recaptchaToken);

      // Re-read: the page's copy is stale by the time the customer presses pay.
      const link = await db.bookingLink.findUnique({
        where: { token: input.token },
      });

      if (!link) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This booking link is not valid.",
        });
      }
      assertLinkUsable(link);

      const quote = computeBookingLinkQuote({
        adultPricePaise: link.adultPricePaise,
        childPricePaise: link.childPricePaise,
        gstRate: link.gstRate,
        adultCount: input.numOfAdults,
        childCount: input.numOfChildren,
        paymentType: link.paymentType,
        advancePercent: link.advancePercent,
      });

      if (quote.payableNowPaise < MIN_ORDER_PAISE) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Please select at least one guest to continue.",
        });
      }

      /**
       * Resolve the schedule NOW rather than trusting link.scheduleId — one may
       * have been created, edited or deleted since the link was generated,
       * whether by an admin or by another customer's schedule.create order.
       */
      const resolved = await resolveScheduleForPackageDate({
        packageId: link.packageId,
        scheduleId: link.scheduleId ?? undefined,
        selectedScheduleDate: format(link.scheduleDay, "yyyy-MM-dd"),
        // The sale was agreed when the link was issued. Hiding the package
        // afterwards removes it from the public site; it must not strand a
        // customer holding a link that has not expired yet.
        allowHidden: true,
      });

      const sharedInput = {
        name: input.name,
        email: input.email,
        phone: input.phone,
        numOfAdults: input.numOfAdults,
        numOfChildren: input.numOfChildren,
        numOfBaby: input.numOfBaby,
        packageId: link.packageId,
        packageCategory: resolved.packageIdExists.packageCategory,
        selectedScheduleDate: format(link.scheduleDay, "yyyy-MM-dd"),
        scheduleId: resolved.schedule?.id,
        token: input.recaptchaToken ?? null,
      };

      const order =
        resolved.decider === "schedule.existing"
          ? await CreateBookingForExistingSchedule({
              input: sharedInput,
              packageIdExists: resolved.packageIdExists,
              schedule: resolved.schedule,
              pricingOverride: { amountPaise: quote.payableNowPaise },
              extraNotes: { bookingLinkId: link.id },
            })
          : await CreateBookingForCreateSchedule({
              input: sharedInput,
              packageIdExists: resolved.packageIdExists,
              scheduleTime: resolved.scheduleTime,
              pricingOverride: { amountPaise: quote.payableNowPaise },
              extraNotes: { bookingLinkId: link.id },
              skipMinimumCountCheck: link.allowBelowMinimum,
            });

      /**
       * Persist what the customer was actually quoted. The webhook prefers
       * these figures over recomputing, so the booking is recorded against the
       * number they saw on screen.
       */
      await db.bookingLink.update({
        where: { id: link.id },
        data: {
          razorpayOrderId: order.order.id,
          quotedTotalPaise: quote.fullTotalPaise,
          payableNowPaise: quote.payableNowPaise,
          orderAdultCount: input.numOfAdults,
          orderChildCount: input.numOfChildren,
          orderBabyCount: input.numOfBaby,
          orderName: input.name,
          orderEmail: input.email,
          orderPhone: input.phone,
          reservedBookingId: order.bookingId,
        },
      });

      return {
        order: order.order,
        bookingId: order.bookingId,
        quote,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEYID,
      };
    }),
});
