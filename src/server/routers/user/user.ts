import { nanoid } from "nanoid";
import { db } from "@/db";
import {
  checkScheduleStatusForTheSelectedDate,
  findScheduleById,
} from "@/db/data/dto/schedule";
import {
  checkBookingTimeConstraint,
  isCurrentMonthSameAsRequestedMonth,
  isDateValid,
  parseDateFormatYYYMMDDToNumber,
  RemoveTimeStampFromDate,
} from "@/lib/utils";
import { onlineBookingFormValidator } from "@/lib/validators/onlineBookingValidator";
import { isBreakFast } from "@/lib/validators/Package";
import { isStatusBreakfast } from "@/lib/validators/Schedules";
import { publicProcedure, router } from "@/server/trpc";
import { $Enums } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  differenceInHours,
  differenceInMinutes,
  endOfMonth,
  format,
  startOfMonth,
} from "date-fns";
import { promise, z } from "zod";
import { totalBookedSeats } from "@/db/data/dto/booking";
import { MAX_BOAT_SEAT } from "@/constants/config/business";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";
import Razorpay from "razorpay";
import { $RazorPay } from "@/lib/helpers/RazorPay";
import { zodResolver } from "@hookform/resolvers/zod";
import { findPackageById } from "@/db/data/dto/package";

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
  getSchedulesByPackageIdAndDate: publicProcedure
    .input(
      z.object({
        packageTime: z.string(),
        packageId: z.string(),
        date: z.string(),
      }),
    )
    .query(
      async ({ ctx, input: { date: clientDate, packageId, packageTime } }) => {
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

          const currentServerDate = RemoveTimeStampFromDate(
            new Date(Date.now()),
          );
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

          const [schedules, blockedScheduleDateArray] = await Promise.all([
            db.schedule.findMany({
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
            }),

            db.schedule.findMany({
              where: {
                // @ts-ignore
                schedulePackage: packageTime,
                scheduleStatus: "BLOCKED",
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
              select: {
                day: true,
              },
            }),
          ]);

          // console.log(schedules);
          return { schedules, blockedScheduleDateArray };
        } catch (error) {
          if (error instanceof TRPCError) {
            throw new TRPCError({ code: error.code, message: error.message });
          }
        }
      },
    ),
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
          packageTime,
        },
      }) => {
        try {
          const packageIdExists = await findPackageById(packageId);

          if (!packageIdExists) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Could not find given packageId",
            });
          }

          if (!scheduleId) {
            const isScheduleBlocked =
              await checkScheduleStatusForTheSelectedDate({
                date: selectedScheduleDate,
                packageTime,
              });

            if (isScheduleBlocked) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "Selected Schedule blocked, please select another date/Package ",
              });
            }

            const totalCount = numOfAdults + numOfChildren;
            if (totalCount < 25) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "Count Should of minimum 25, for a new created schedule",
              });
            }

            const bookingRequestCameBeforeTimeConstraint = checkBookingTimeConstraint({
                packageTime,
                selectedDate: selectedScheduleDate,
                startFrom: packageIdExists.fromTime,
              });

            if (!bookingRequestCameBeforeTimeConstraint) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "Could not complete booking as it is too late for the selected data, please select a different package or date",
              });
            }
          }

          // ==================================================================================================================
          if (scheduleId) {
            const isSchedulePresentInDb = await findScheduleById(scheduleId);

            if (!isSchedulePresentInDb) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Could not find schedule Id",
              });
            }

            const bookedCount = await totalBookedSeats(scheduleId);
            const remainingSeats = MAX_BOAT_SEAT - bookedCount;
            const totalSeatsSelected = numOfAdults + numOfChildren + numOfBaby;

            if (totalSeatsSelected > remainingSeats) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "Selected Seats exceeds maximum capacity, please select a different schedule",
              });
            }

            const packageDetails = await db.package.findUnique({
              where: {
                id: packageId,
              },
              select: {
                adultPrice: true,
                childPrice: true,
                title: true,
              },
            });

            if (!packageDetails) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Could not get price details",
              });
            }

            const TotalAdultPrice = packageDetails.adultPrice * numOfAdults;
            const TotalChildPrice = packageDetails.childPrice * numOfChildren;
            const GrandTotal = TotalAdultPrice + TotalChildPrice;

            const createUser = await db.user.create({
              data: {
                name,
                email,
                contact: phone,
              },
              select: {
                id: true,
              },
            });

            if (!createUser) {
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Could not Complete request, failed to create user",
              });
            }
            /**
             * @TODO
             *
             * write code in FE to send total amount displayed to client and
             * compare the GrantTotal calculated in the server , and make sure both amount are the same
             *
             *  */

            // ----------CREATING OPTIONS USING RAZOR PAY -----------------------

            // TODO: Make sure to handle your payment here.
            // Create an order -> generate the OrderID -> Send it to the Front-end
            // Also, check the amount and currency on the backend (Security measure)
            // const scheduleDetails = await db.schedule.findUnique({
            //   where: {
            //     id: scheduleId,
            //   },
            //   select: {
            //     schedulePackage: true,
            //     scheduleStatus: true,
            //   },
            // });

            // if (!scheduleDetails) {
            //   throw new TRPCError({
            //     code: "INTERNAL_SERVER_ERROR",
            //     message: "Could not get schedule data",
            //   });
            // }

            const payment_capture = 1;
            const amount = GrandTotal;
            const currency = "INR";
            const options = {
              amount,
              currency,
              payment_capture,
              notes: {
                eventType: "existing.schedule",
                packageId: packageId,
                scheduleId: scheduleId,
                name: name,
                email: email,
                adultCount: numOfAdults,
                childCount: numOfChildren,
                babyCount: numOfBaby,
              },
            };

            // {
            //   "eventType": "create.schedule",
            //   "packageId": "1515151",
            //   "schedule": {
            //     "Date": "YYYY-MM-DD",
            //     "ScheduleTime": "BREAKFAST"
            //   },
            //   "booking": {
            //     "name": "customer.name",
            //     "phone": "customer.phone",
            //     "email": "customer.email",
            //     "adultCount": 1,
            //     "childCount": 1,
            //     "babyCount": 1
            //   }
            // },
            const order = await $RazorPay.orders.create(options);

            const data = {
              message: "success",
              order,
            };
            console.log(data);
            return data;
            // ==============================================================================
          }
        } catch (error) {
          if (error instanceof zodResolver) {
            console.log("Zod error");
          }
          ErrorLogger(error);
          console.log(error);
          return null;
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
      },
    ),
});
