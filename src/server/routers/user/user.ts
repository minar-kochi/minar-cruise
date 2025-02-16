import { db } from "@/db";
import axios from "axios";
import {
  isCurrentMonthSameAsRequestedMonth,
  isDateValid,
  parseDateFormatYYYMMDDToNumber,
  RemoveTimeStampFromDate,
} from "@/lib/utils";
import { onlineBookingFormValidator } from "@/lib/validators/onlineBookingValidator";
import { publicProcedure, router } from "@/server/trpc";
import { $Enums, PrismaClient, SCHEDULED_TIME } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { z } from "zod";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";
import { findPackageByIdExcludingCustomAndExclusive } from "@/db/data/dto/package";
import { decideCreateOrExisting } from "@/lib/helpers/RequestToCreateSchedule";
import { CreateBookingForCreateSchedule } from "./userBookingCreateScheduleTRPC";
import { CreateBookingForExistingSchedule } from "./userBookingExistingScheduleTRPC";
import { findCorrespondingScheduleTimeFromPackageCategory } from "@/lib/Data/manipulators/ScheduleManipulators";
import { ScheduleConflictError } from "@/Types/Schedule/ScheduleConflictError";
import { exclusivePackageValidator } from "@/lib/validators/exclusivePackageContactValidator";
import { sendNodeMailerEmail } from "@/lib/helpers/resend";
import ExclusiveBookingEmailToAdmin from "@/components/services/sendExclusiveBooking";
import { render } from "@react-email/components";
import { ScheduleGrouped } from "@/Types/Schedule/ScheduleSelect";

export type QueryObj = [
  { id: string | undefined },
  { day: Date; schedulePackage: SCHEDULED_TIME },
];

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
      try {
        if (!token) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Please give access to Recaptcha",
          });
        }
        const formData = `secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${token}`;
        const res = await axios.get(
          `https://www.google.com/recaptcha/api/siteverify?${formData}`,
        );
        if (res && res.data?.success && res.data?.score < 0.5) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "Recaptcha Failed",
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({ code: error.code, message: error.message });
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Failed to validate Recaptcha Please try again, or contact admin",
        });
      }

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
          },
          orderBy: {
            day: "asc",
          },
        });
        const schedules = data.filter((fv) => fv.packageId === packageId);
        const blockedScheduleDateArray = data
          .filter(
            (fv) =>
              fv.scheduleStatus === "BLOCKED" ||
              fv.scheduleStatus === "EXCLUSIVE",
          )
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
      try {
        if (!input.token) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Please give access to Recaptcha, or Contact Admins",
          });
        }
        const formData = `secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${input.token}`;
        const res = await axios.get(
          `https://www.google.com/recaptcha/api/siteverify?${formData}`,
        );
        if (res && res.data?.success && res.data?.score < 0.5) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message:
              "Failed to validate Recaptcha Please try again, or contact admin",
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({ code: error.code, message: error.message });
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Failed to validate Recaptcha Please try again, or contact admin",
        });
      }
      try {
        // Check if the package trying to book is either exist or it is available for public to book
        const packageIdExists =
          await findPackageByIdExcludingCustomAndExclusive(packageId);

        if (!packageIdExists) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not find given package",
          });
        }

        // Mapping Package to specific schedule timing
        const scheduleTimeForPackage =
          findCorrespondingScheduleTimeFromPackageCategory(
            packageIdExists.packageCategory,
          );
        if (!scheduleTimeForPackage) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "Couldn't find any package that are available to public",
          });
        }
        /**
         * check in query object to check whether the schedule already exists or to be created.
         */
        let queryObj: QueryObj = [
          // This Could be Undefined
          { id: scheduleId },
          // This will be known, we know the date the user Whats to book, and the package they are preffered to book
          {
            day: new Date(selectedScheduleDate),
            schedulePackage: scheduleTimeForPackage,
          },
        ];

        /**
         *  Random Id is passed then there wont be a schedule and it will go to schedule create event assuming there are no schedule.
         *  if there are and if its set to blocked or exlusive should throw a error response
         */
        const schedule = await db.schedule.findFirst({
          select: {
            id: true,
            schedulePackage: true,
            packageId: true,
            day: true,
            fromTime: true,
            scheduleStatus: true,
            toTime: true,
            Package: {
              select: {
                title: true,
                slug: true,
              },
            },
          },
          where: {
            OR: queryObj,
          },
        });

        // If the schedule is set to blocked then throw that time is already booked or blocked.
        if (
          //
          schedule?.scheduleStatus === "BLOCKED" ||
          schedule?.scheduleStatus === "EXCLUSIVE"
        ) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message:
              "Schedule for selected date is blocked, Please try diffrent date.",
          });
        }
        // If there is no schedule then event will try to generate a event.
        const decider = decideCreateOrExisting(schedule?.id);

        switch (decider) {
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
            if (!schedule || !schedule.id) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "Sorry, We didn't find the schedule appropriate to what you are looking for..",
              });
            }
            if (schedule.packageId !== packageIdExists.id) {
              let ScheduleConflictError: ScheduleConflictError = {
                title: schedule.Package?.title ?? "",
                slug: schedule.Package?.slug ?? "",
                subCode: "SCHEDULE_CONFLICT_WITH_PACKAGE",
                message: `There is Another Schedule at this Date and Time, Please Check ${schedule.Package?.title} to book for this date`,
              };
              throw new TRPCError({
                code: "CONFLICT",
                message: JSON.stringify(ScheduleConflictError),
              });
            }
            return await CreateBookingForExistingSchedule({
              input,
              packageIdExists,
              schedule,
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
      try {
        if (!token) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Please give access to Recaptcha",
          });
        }
        const formData = `secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${token}`;
        const res = await axios.get(
          `https://www.google.com/recaptcha/api/siteverify?${formData}`,
        );
        if (res && res.data?.success && res.data?.score < 0.5) {
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "Recaptcha Failed",
          });
        }
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
          hasNextPage: !!nextCursor 
        };
      },
    ),
});
