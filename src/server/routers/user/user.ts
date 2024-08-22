import { db } from "@/db";
import { findScheduleById } from "@/db/data/dto/schedule";
import {
  isCurrentMonthSameAsRequestedMonth,
  isDateValid,
  parseDateFormatYYYMMDDToNumber,
  RemoveTimeStampFromDate,
} from "@/lib/utils";
import { onlineBookingFormValidator } from "@/lib/validators/onlineBookingValidator";
import { isStatusBreakfast } from "@/lib/validators/Schedules";
import { publicProcedure, router } from "@/server/trpc";
import { $Enums } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { differenceInHours, differenceInMinutes, endOfMonth, startOfMonth } from "date-fns";
import { z } from "zod";

export const user = router({
  getSchedulesByPackageIdAndDate: publicProcedure
    .input(
      z.object({
        packageId: z.string(),
        date: z.string(),
      }),
    )
    .query(async ({ ctx, input: { date: clientDate, packageId } }) => {
      try {
        const isPackageExist = await db.package.count({
          where: {
            id: packageId,
          },
        });
        if (!isPackageExist) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Package not found!",
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

        /**
         * Change this Logic to another func.
         */
        // const day = isSameMonth
        //   ? {
        //       gte: new Date(currentServerDate),
        //       lte: new Date(endOfTheMonthServerDate),
        //     }
        //   : {
        //       gte: new Date(startOfMonthClientDate),
        //       lte: new Date(endOfMonthClientDate),
        //     };
        // console.log(day)
        // case 1
        const schedules = await db.schedule.findMany({
          select: {
            id: true,
            packageId: true,
            day: true,
            scheduleStatus: true,
          },
          where: {
            packageId,
            day: isSameMonth
              ? {
                  gte: new Date(currentServerDate),
                  lte: new Date(endOfTheMonthServerDate),
                }
              : {
                  gte: new Date(startOfMonthClientDate),
                  lte: new Date(endOfMonthClientDate),
                },
          },
          orderBy: {
            day: "asc",
          },
        });
        // console.log(schedules);
        return schedules;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({ code: error.code, message: error.message });
        }
      }
    }),
  createRazorPayIntent: publicProcedure
    .input(onlineBookingFormValidator)
    .mutation(
      async ({
        ctx,
        input: {
          email,
          name,
          numOfAdults,
          numOfBaby,
          numOfChildren,
          packageId,
          phone,
          scheduleId,
          selectedScheduleDate,
        },
      }) => {
        /**
         * COMMON CHECK!
         * - check if the package is breakfast ,if yes check if all request are coming before 16 hours
         *      // Questionable. @{TODO}
         *    - check if the package is package with food is before , 3 hours earlier
         *
         */

        /**
         * IF SCHEDULE ID EXISTS.
         *  1. check if the schedule id exists
         *       - if schedule exists then check  whether the seat is full or have enough seating capacity.
         *              @success
         *              - then create the razor-pay payment link
         *
         */

        /**
         * IF SCHEDULE NOT EXISTS > MEANING NEED TO ADD A NEW SCHEDULE AND UPDATE THE DATA.
         * - if not exists then tedious task.
         *    - make sure there isn't any schedule on selected Date with ENUM. or Package name ..... (Think more.)
         *    - check if the packageId exists and not exclusive.
         *    - check if the selected date is greater than today @see {Reuse-COMMON-CHECK}
         *    - check if the request is before 16 hours. @see {Reuse-COMMON-CHECK}
         *    - check if the request package is sunset cruise.
         *          @[Think more about this.] -> we are adding new ENUM SUNSET.
         *          - if it is sunset cruise then check-wether there is a a dinner cruise or sunset is blocked .
         *          -if sunset is okay, then allow to create a razor-pay payment link and proceed.
         *          - if not then return and throw error
         *          -
         *
         */

        const packageDetails = await db.package.findUnique({
          where: {
            id: packageId,
          },
          select: {
            packageCategory: true,
            title: true
          },
        });

        if (!packageDetails) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not receive package data",
          });
        }
        // isStatusBreakfast(packageDetails.packageCategory)
        const isBreakFast =
          packageDetails.packageCategory === $Enums.PACKAGE_CATEGORY.BREAKFAST;
        const isLunch =
          packageDetails.packageCategory === $Enums.PACKAGE_CATEGORY.LUNCH;
        const isDinner =
          packageDetails.packageCategory === $Enums.PACKAGE_CATEGORY.DINNER;
        const isExclusive =
          packageDetails.packageCategory === $Enums.PACKAGE_CATEGORY.EXCLUSIVE;

        const serverDate = new Date(Date.now());
        const timeGapInHours = differenceInHours(selectedScheduleDate, serverDate);
        const timeGapInMinutes = differenceInMinutes(selectedScheduleDate,serverDate);

        if (isBreakFast) {
          if (timeGapInHours <= 16) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Select a different package ,You need to book breakfast at least 16 hours before schedule time",
            });
          }
        }

        if(isLunch) {
          if(timeGapInMinutes <= 15) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "Select a different package ,You need to book lunch at least 2 hours before schedule time",
            });
          }
        }

        if(isDinner && packageDetails.title === "sunset cruise"){
          
        }
        if(isDinner && packageDetails.title === "Dinner cruise"){

        }
        if(isDinner && packageDetails.title === "Sunset with Dinner cruise"){

        }
        if(isDinner && packageDetails.title === "Special 4 Hours Dinner Cruise"){

        }

        if(isExclusive){

        }

// ----------------------------------------------------------------------------
        if (scheduleId) {
          const scheduleIdExists = findScheduleById(scheduleId);
          if (!scheduleIdExists)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "need at least a total of 25 seat count to confirm a new booking",
            });

          const scheduleDetails = await db.schedule.findUnique({
            where: {
              id: scheduleId,
            },
            select: {
              day: true,
            },
          });

          if (!scheduleDetails) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "could not get schedule details",
            });
          }

          const packageExists = await db.package.count({
            where: {
              id: packageId,
            },
          });

          if (!packageExists) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Selected package does not exists",
            });
          }
        }

        if (!scheduleId) {
          if (numOfAdults + numOfChildren < 25) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "need at least a total of 25 seat count to confirm a new booking",
            });
          }
        }
      },
    ),
});
