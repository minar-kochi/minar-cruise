import { db } from "@/db";
import { createBookingLink } from "@/db/data/creator/bookingLink";
import {
  getSelectableSchedulesForLink,
  listBookingLinks,
} from "@/db/data/dto/bookingLink";
import { resolveBookingLinkExpiry } from "@/lib/helpers/bookingLink/expiry";
import { deriveScheduleInstants } from "@/lib/helpers/scheduleInstants";
import { bookingLinkUrl } from "@/lib/helpers/bookingLink/url";
import { getTaxConfig } from "@/lib/helpers/getTaxConfig";
import { getBookingConfig } from "@/lib/helpers/config/getBookingConfig";
import { resolvePackageBookingRule } from "@/lib/config/bookingConfig.types";
import { resolveScheduleForPackageDate } from "@/lib/helpers/resolveScheduleForPackageDate";
import { generateBookingLinkSchema } from "@/lib/validators/bookingLink";
import { AdminProcedure, router } from "@/server/trpc";
import { $Enums } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { z } from "zod";

/** Blank optional inputs arrive as "" from the form; store null instead. */
const nullIfBlank = (v: string | undefined) => (v && v.length ? v : null);

export const bookingLink = router({
  /**
   * Upcoming schedules the admin can issue a link against — the same list as
   * Manage Schedules, so the date and its package always agree and the admin
   * never has to pair them by hand.
   */
  getSelectableSchedules: AdminProcedure.input(
    z.object({
      cursor: z.string().nullish(),
      limit: z.number().min(1).max(100).nullish(),
    }),
  ).query(async ({ input }) => {
    return await getSelectableSchedulesForLink({
      cursor: input.cursor,
      limit: input.limit,
    });
  }),

  generate: AdminProcedure.input(generateBookingLinkSchema).mutation(
    async ({ ctx, input }) => {
      const schedule = await db.schedule.findUnique({
        where: { id: input.scheduleId },
        select: {
          id: true,
          day: true,
          packageId: true,
          scheduleStatus: true,
        },
      });

      if (!schedule || !schedule.packageId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "That schedule no longer exists, or has no package attached. Please pick another.",
        });
      }

      const scheduleDate = format(schedule.day, "yyyy-MM-dd");

      /**
       * Run the same resolution the customer will hit at pay time, so a link
       * can never be generated for a combination checkout would reject —
       * blocked/exclusive slot, non-public package, or a slot whose package has
       * since changed. The bound scheduleId is only a hint; it is re-resolved
       * when the order is created, since the schedule may be edited or deleted
       * in between.
       */
      const resolved = await resolveScheduleForPackageDate({
        packageId: schedule.packageId,
        scheduleId: schedule.id,
        selectedScheduleDate: scheduleDate,
        // An admin issuing a link for a hidden package is doing so
        // deliberately — "hidden" means off the public site, not withdrawn
        // from sale. This is an AdminProcedure; the visibility gate is there
        // to close the public path, not this one.
        allowHidden: true,
      });

      const { packageIdExists: pkg, scheduleTime } = resolved;
      const boundScheduleId =
        resolved.decider === "schedule.existing" ? resolved.schedule.id : null;

      /**
       * Snapshot the prices and GST rate. The admin has quoted a figure on the
       * phone; a later package edit or tax change must not silently move it.
       */
      const taxConfig = await getTaxConfig();
      const bookingRule = resolvePackageBookingRule(
        pkg,
        await getBookingConfig(),
      );

      const { expiresAt, clampedToDeparture } = resolveBookingLinkExpiry({
        scheduleDate,
        departureTime: pkg.fromTime,
        expiryHours: input.expiryHours,
        rule: bookingRule,
      });

      if (expiresAt.getTime() <= Date.now()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "That cruise is too close to departure to issue a payment link for. Please pick a later date.",
        });
      }

      /**
       * Freeze the departure this link is being sold against, for the same
       * reason the prices above are frozen: the admin has quoted a sailing time
       * on the phone, and a later package edit must not silently move it.
       *
       * Prefer the resolved schedule's own instants — that row is the authority
       * when it already exists, and it may carry an admin override that differs
       * from the package default. Fall back to deriving from the package for a
       * date that has no Schedule row yet.
       */
      const sailing =
        resolved.decider === "schedule.existing" && resolved.schedule.startsAt
          ? {
              startsAt: resolved.schedule.startsAt,
              endsAt: resolved.schedule.endsAt,
            }
          : deriveScheduleInstants({
              day: schedule.day,
              packageStartMinutesIst: pkg.startMinutesIst,
              packageDurationMinutes: pkg.duration,
            });

      const link = await createBookingLink({
        packageId: pkg.id,
        scheduleDay: new Date(scheduleDate),
        schedulePackage: scheduleTime,
        scheduleId: boundScheduleId,
        scheduleStartsAt: sailing.startsAt,
        scheduleEndsAt: sailing.endsAt,

        adultPricePaise: pkg.adultPrice,
        childPricePaise: pkg.childPrice,
        gstRate: taxConfig.gstRate,

        paymentType: input.paymentType,

        prefillName: nullIfBlank(input.prefillName),
        prefillEmail: nullIfBlank(input.prefillEmail),
        prefillPhone: nullIfBlank(input.prefillPhone),
        prefillAdultCount: input.prefillAdultCount,
        prefillChildCount: input.prefillChildCount,
        prefillBabyCount: input.prefillBabyCount,

        expiresAt,
        allowBelowMinimum: input.allowBelowMinimum,
        adminNote: nullIfBlank(input.adminNote),
        createdBy: ctx.AdminUser?.id ?? null,
      });

      return {
        link,
        /**
         * Built server-side: absoluteUrl() returns a bare path when called in
         * the browser, which would make the WhatsApp/SMS share useless.
         */
        url: bookingLinkUrl(link.token),
        clampedToDeparture,
      };
    },
  ),

  list: AdminProcedure.input(
    z.object({
      cursor: z.string().nullish(),
      limit: z.number().min(1).max(100).nullish(),
      status: z
        .enum(["ALL", "ACTIVE", "PAID", "EXPIRED", "CANCELLED"])
        .default("ALL"),
    }),
  ).query(async ({ input }) => {
    const { items, nextCursor } = await listBookingLinks({
      cursor: input.cursor,
      limit: input.limit,
      status: input.status as $Enums.BOOKING_LINK_STATUS | "ALL",
    });

    return {
      items: items.map((item) => ({
        ...item,
        url: bookingLinkUrl(item.token),
      })),
      nextCursor,
    };
  }),

  cancel: AdminProcedure.input(z.object({ id: z.string() })).mutation(
    async ({ input }) => {
      const link = await db.bookingLink.findUnique({
        where: { id: input.id },
        select: { status: true },
      });

      if (!link) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not find that booking link",
        });
      }

      // A paid link is a receipt for money taken — it must stay auditable.
      if (link.status === "PAID") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This link has already been paid and cannot be cancelled. Delete the booking instead if it needs reversing.",
        });
      }

      return await db.bookingLink.update({
        where: { id: input.id },
        data: { status: "CANCELLED" },
      });
    },
  ),
});
