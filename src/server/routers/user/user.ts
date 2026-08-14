import ExclusiveBookingEmailToAdmin from "@/components/services/sendExclusiveBooking";
import { db } from "@/db";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";
import { verifyRecaptcha } from "@/lib/helpers/recaptcha";
import { resolveScheduleForPackageDate } from "@/lib/helpers/resolveScheduleForPackageDate";
import { sendNodeMailerEmail } from "@/lib/helpers/resend";
import {
  isCurrentMonthSameAsRequestedMonth,
  isDateValid,
  parseDateFormatYYYMMDDToNumber,
  RemoveTimeStampFromDate,
} from "@/lib/utils";
import { exclusivePackageValidator } from "@/lib/validators/exclusivePackageContactValidator";
import { onlineBookingFormValidator } from "@/lib/validators/onlineBookingValidator";
import { publicProcedure, router } from "@/server/trpc";
import { $Enums, PrismaClient, SCHEDULED_TIME } from "@prisma/client";
import { render } from "@react-email/components";
import { TRPCError } from "@trpc/server";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { z } from "zod";
import { bookingLink } from "./bookingLink";
import { CreateBookingForCreateSchedule } from "./userBookingCreateScheduleTRPC";
import { CreateBookingForExistingSchedule } from "./userBookingExistingScheduleTRPC";
import { getUserBookingDetails, totalBookedSeats } from "@/db/data/dto/booking";
import { cuidRegex } from "@/lib/helpers/regex";
import { BookingCuidValidator } from "@/lib/validators/Booking";
import { MAX_BOAT_SEAT } from "@/constants/config/business";

type TBlockedScheduleDateArray = {
  day: Date;
}[];

type TScheduleData = {
  id: string;
  day: Date;
  packageId: string | null;
  scheduleStatus: $Enums.SCHEDULE_STATUS;
}[];

export const user = router({
  bookingLink,
  createSubscription: publicProcedure
    .input(
      z.object({
        name: z.string().min(3, {
          message: "Min 3 letter req.",
        }),
        email: z.string().email({ message: "Invalid email" }),
        token: z.string().optional(),
      }),
    )
    .mutation(async ({ input: { email, name, token } }) => {
      await verifyRecaptcha(token);

      try {
        const data = await db.user.create({
          data: {
            name,
            email,
          },
        });

        return data.id;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something went wrong",
        });
      }
    }),
  getSchedulesByPackageIdAndDate: publicProcedure
    .input(
      z.object({
        packageId: z.string(),
        date: z.string(),
      }),
    )
    .query(async ({ ctx, input: { date: clientDate, packageId } }) => {
      try {
        const isPackageExist = await db.package.findFirst({
          where: {
            id: packageId,
          },
          select: {
            id: true,
            packageCategory: true,
          },
        });

        if (!isPackageExist) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Package not found!",
          });
        }
        let packageTime = isPackageExist.packageCategory;

        if (packageTime === "CUSTOM" || packageTime === "EXCLUSIVE") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "This package Cannot booked.",
          });
        }
        const date = parseDateFormatYYYMMDDToNumber(clientDate);

        if (!date) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Date Format is not valid YYYY-MM-DD",
          });
        }

        const validatedDate = isDateValid(date);

        if (!validatedDate) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Requested date is invalid",
          });
        }

        const isSameMonth = isCurrentMonthSameAsRequestedMonth(clientDate);

        const currentServerDate = RemoveTimeStampFromDate(new Date(Date.now()));

        const endOfTheMonthServerDate = RemoveTimeStampFromDate(
          endOfMonth(currentServerDate),
        );

        const startOfMonthClientDate = RemoveTimeStampFromDate(
          startOfMonth(clientDate),
        );

        const endOfMonthClientDate = RemoveTimeStampFromDate(
          endOfMonth(clientDate),
        );
        const dateRange = isSameMonth
          ? {
              gte: new Date(currentServerDate),
              lte: new Date(endOfTheMonthServerDate),
            }
          : {
              gte: new Date(startOfMonthClientDate),
              lte: new Date(endOfMonthClientDate),
            };

        const data = await db.schedule.findMany({
          where: {
            day: dateRange,
            OR: [
              { packageId },
              {
                scheduleStatus: { in: ["BLOCKED", "EXCLUSIVE"] },
                schedulePackage: packageTime,
              },
            ],
          },
          select: {
            packageId: true,
            day: true,
            id: true,
            scheduleStatus: true,
            schedulePackage: true,
            Booking: {
              select: {
                totalBooking: true,
              },
            },
          },
          orderBy: {
            day: "asc",
          },
        });

        const schedules = data.filter((fv) => fv.packageId === packageId);

        // Calculate total booked seats for each schedule and filter blocked dates
        const blockedScheduleDateArray = data
          .filter((schedule) => {
            // Check if explicitly blocked or exclusive
            if (
              schedule.scheduleStatus === "BLOCKED" ||
              schedule.scheduleStatus === "EXCLUSIVE"
            ) {
              return true;
            }

            // Check if schedule belongs to the requested package and is at max capacity
            if (schedule.packageId === packageId) {
              const totalBookedSeats = schedule.Booking.reduce(
                (sum, booking) => sum + booking.totalBooking,
                0
              );
              return totalBookedSeats >= MAX_BOAT_SEAT;
            }

            return false;
          })
          .map((item) => ({ day: item.day }));

        return { schedules, blockedScheduleDateArray };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({ code: error.code, message: error.message });
        }
        if (error instanceof PrismaClient) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong while retrieving data",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something unexpected happened.",
        });
      }
    }),
  createRazorPayIntent: publicProcedure
    .input(onlineBookingFormValidator)
    .mutation(async ({ ctx, input }) => {
      const { packageId, scheduleId, selectedScheduleDate } = input;
      await verifyRecaptcha(input.token, {
        missingTokenMessage: "Please give access to Recaptcha, or Contact Admins",
        lowScoreMessage:
          "Failed to validate Recaptcha Please try again, or contact admin",
      });
      try {
        const resolved = await resolveScheduleForPackageDate({
          packageId,
          scheduleId,
          selectedScheduleDate,
        });
        const { packageIdExists, scheduleTime: scheduleTimeForPackage } =
          resolved;

        switch (resolved.decider) {
          // No schedule found.
          case "schedule.create": {
            // add schedule create event
            return await CreateBookingForCreateSchedule({
              input,
              packageIdExists,
              scheduleTime: scheduleTimeForPackage,
            });
          }
          case "schedule.existing": {
            // add schedule Existing event here
            return await CreateBookingForExistingSchedule({
              input,
              packageIdExists,
              schedule: resolved.schedule,
            });
          }
          default: {
            throw new TRPCError({
              code: "NOT_IMPLEMENTED",
              message: "Cat and Mouse ;)",
            });
          }
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({ code: error.code, message: error.message });
        }
        ErrorLogger(error);
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something unexpected Happened, Please contact Admins",
        });
      }
    }),

  sendExclusiveBookingMessage: publicProcedure
    .input(exclusivePackageValidator)
    .mutation(async ({ ctx, input }) => {
      const { email, name, phone, token } = input;
      /**
       * if user exists dont create. or else create the user into the database.
       */
      await verifyRecaptcha(token);
      try {
        const isUserExists = await db.user.findFirst({
          where: {
            email,
          },
        });

        if (!isUserExists?.id) {
          await db.user.create({
            data: {
              email,
              name,
              contact: phone,
            },
          });
        }
        const emailCom = await render(
          ExclusiveBookingEmailToAdmin({
            ...input,
            selectedDate: format(
              new Date(input.selectedDate),
              "iii dd-MMM-yyyy",
            ),
          }),
        );
        let data = await sendNodeMailerEmail({
          reactEmailComponent: emailCom,
          subject: "Exclusive booking Leads",
          fromEmail: process.env.NEXT_PUBLIC_LEADS_EMAIL,
          toEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL!,
        });
        if (!data?.messageId) {
          throw new TRPCError({
            code: "SERVICE_UNAVAILABLE",
            message: "Something went wrong while reaching out",
          });
        }
        return true;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({ code: error.code, message: error.message });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  searchSchedules: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(3),
        cursor: z.string().optional(),
        packageIds: z.string().array().optional(),
        clientDate: z.string().optional(),
      }),
    )
    .query(
      async ({ ctx, input: { packageIds, clientDate, cursor, limit } }) => {
        let reqData = clientDate ?? RemoveTimeStampFromDate(new Date());

        const isSameMonth = isCurrentMonthSameAsRequestedMonth(reqData);

        const currentServerDate = RemoveTimeStampFromDate(new Date(Date.now()));

        const endOfTheMonthServerDate = RemoveTimeStampFromDate(
          endOfMonth(currentServerDate),
        );

        const startOfMonthClientDate = RemoveTimeStampFromDate(
          startOfMonth(reqData),
        );

        const endOfMonthClientDate = RemoveTimeStampFromDate(
          endOfMonth(reqData),
        );
        const dateRange = isSameMonth
          ? {
              gte: new Date(currentServerDate),
              lte: new Date(endOfTheMonthServerDate),
            }
          : {
              gte: new Date(startOfMonthClientDate),
              lte: new Date(endOfMonthClientDate),
            };

        const schedules = await db.schedule.findMany({
          where: {
            day: dateRange,
            scheduleStatus: "AVAILABLE",
            packageId: packageIds?.length ? { in: packageIds } : undefined,
          },
          select: {
            packageId: true,
            day: true,
            id: true,
            scheduleStatus: true,
            schedulePackage: true,
          },
          cursor: cursor ? { id: cursor } : undefined,
          take: limit + 1,
          orderBy: [
            {
              day: "asc",
            },
            {
              fromTime: "asc",
            },
          ],
        });

        // Get unique dates in order
        let nextCursor: typeof cursor | undefined = undefined;
        if (schedules.length > limit) {
          const nextItem = schedules[limit];
          // const nextItem = schedules.pop();
          nextCursor = nextItem ? nextItem.id : undefined;
        }

        // Safe way to access the extra item

        return {
          schedules: schedules.slice(0, limit),
          nextCursor,
          hasNextPage: !!nextCursor,
        };
      },
    ),
  getUserBookingDetails: publicProcedure
    .input(BookingCuidValidator)
    .query(async ({ input: { bookingId } }) => {
      return await getUserBookingDetails(bookingId);
    }),
});
