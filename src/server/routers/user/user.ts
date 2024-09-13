import { db } from "@/db";

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
import { endOfMonth, startOfMonth } from "date-fns";
import { z } from "zod";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";
import { findPackageByIdExcludingCustomAndExclusive } from "@/db/data/dto/package";
import { decideCreateOrExisting } from "@/lib/helpers/RequestToCreateSchedule";
import { CreateBookingForCreateSchedule } from "./userBookingCreateScheduleTRPC";
import { CreateBookingForExistingSchedule } from "./userBookingExistingScheduleTRPC";
import { findCorrespondingScheduleTimeFromPackageCategory } from "@/lib/Data/manipulators/ScheduleManipulators";
import { ScheduleConflictError } from "@/Types/Schedule/ScheduleConflictError";
import { exclusivePackageValidator } from "@/lib/validators/exclusivePackageContactValidator";
import { sendEmail, sendNodeMailerEmail } from "@/lib/helpers/resend";
import ExclusiveBookingEmailToAdmin from "@/components/services/sendExclusiveBooking";
import { render } from "@react-email/components";

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
      }),
    )
    .mutation(async ({ input: { email, name } }) => {
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
        // Check if the package trying to book is either exist or it is available for public to book
        const packageIdExists =
          await findPackageByIdExcludingCustomAndExclusive(packageId);

        if (!packageIdExists) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not find given packageId",
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

              // throw new TRPCError({
              //   code: "CONFLICT",
              //   message: `There is Another Schedule at this Date and Time, Please Check ${schedule.Package?.title} to book for this date`,
              // });
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

      // if(isLunch) {
      //   if(timeGapInMinutes <= 15) {
      //     throw new TRPCError({
      //       code: "BAD_REQUEST",
      //       message:
      //         "Select a different package ,You need to book lunch at least 2 hours before schedule time",
      //     });
      //   }
      // }

      // if(isDinner && packageDetails.title === "sunset cruise"){

      // }
      // if(isDinner && packageDetails.title === "Dinner cruise"){

      // }
      // if(isDinner && packageDetails.title === "Sunset with Dinner cruise"){

      // }
      // if(isDinner && packageDetails.title === "Special 4 Hours Dinner Cruise"){

      // }

      // if(isExclusive){

      // }

      // // ----------------------------------------------------------------------------
      //         if (scheduleId) {
      //           const scheduleIdExists = findScheduleById(scheduleId);
      //           if (!scheduleIdExists)
      //             throw new TRPCError({
      //               code: "BAD_REQUEST",
      //               message:
      //                 "need at least a total of 25 seat count to confirm a new booking",
      //             });

      //           const scheduleDetails = await db.schedule.findUnique({
      //             where: {
      //               id: scheduleId,
      //             },
      //             select: {
      //               day: true,
      //             },
      //           });

      //           if (!scheduleDetails) {
      //             throw new TRPCError({
      //               code: "BAD_REQUEST",
      //               message: "could not get schedule details",
      //             });
      //           }

      //           const packageExists = await db.package.count({
      //             where: {
      //               id: packageId,
      //             },
      //           });

      //           if (!packageExists) {
      //             throw new TRPCError({
      //               code: "BAD_REQUEST",
      //               message: "Selected package does not exists",
      //             });
      //           }
      //         }

      //         if (!scheduleId) {
      //           if (numOfAdults + numOfChildren < 25) {
      //             throw new TRPCError({
      //               code: "BAD_REQUEST",
      //               message:
      //                 "need at least a total of 25 seat count to confirm a new booking",
      //             });
      //           }
      // }
    }),

  sendExclusiveBookingMessage: publicProcedure
    .input(exclusivePackageValidator)
    .mutation(async ({ ctx, input }) => {
      const { email, name, phone } = input;
      /**
       * if user exists dont create. or else create the user into the database.
       */
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
        const emailCom = await render(ExclusiveBookingEmailToAdmin(input));
        sendNodeMailerEmail({
          reactEmailComponent: emailCom,
          subject: "Exclusive booking Leads",
          fromEmail: process.env.NEXT_PUBLIC_LEADS_EMAIL,
          toEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL!,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
