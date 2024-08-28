import { nanoid } from "nanoid";
import { db } from "@/db";
import { findScheduleById } from "@/db/data/dto/schedule";
import {
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
  startOfMonth,
} from "date-fns";
import { z } from "zod";
import { totalBookedSeats } from "@/db/data/dto/booking";
import { MAX_BOAT_SEAT } from "@/constants/config/business";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";
import Razorpay from "razorpay";
import { $RazorPay } from "@/lib/helpers/RazorPay";
import { zodResolver } from "@hookform/resolvers/zod";

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
    // exampleEndPoint: publicProcedure
    // .mutation(async({ctx, input})=>{
    //   try {
    //     const order = await $RazorPay.orders.create({
    //       amount: 1000,
    //       currency: "INR",
    //     });
    //     console.log(order);
    //     return order;
    //   } catch (error) {
    //     console.log(error);
    //     return null;
    //   }
    // })
    // ,
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

        // const packageDetails = await db.package.findUnique({
        //   where: {
        //     id: packageId,
        //   },
        //   select: {
        //     packageCategory: true,
        //     title: true,
        //   },
        // });

        // if (!packageDetails) {
        //   throw new TRPCError({
        //     code: "BAD_REQUEST",
        //     message: "Could not receive package data",
        //   });
        // }
        // // isStatusBreakfast(packageDetails.packageCategory)

        // const serverDate = new Date(Date.now());
        // const timeGapInHours = differenceInHours(
        //   selectedScheduleDate,
        //   serverDate,
        // );
        // const timeGapInMinutes = differenceInMinutes(
        //   selectedScheduleDate,
        //   serverDate,
        // );

        // if (isBreakFast(packageDetails.packageCategory)) {
        //   if (timeGapInHours <= 16) {
        //     throw new TRPCError({
        //       code: "BAD_REQUEST",
        //       message:
        //         "Select a different package ,You need to book breakfast at least 16 hours before schedule time",
        //     });
        //   }
        // }
        //=======================================================================================

        /**
         * BEST CASE SCENARIO
         *
         * scheduleID received
         * total count is received (adult + child)
         * selected package id in received - from here we can fetch price of the adult and child
         * total price from frontend is received - check if this matches Db price after fetching
         *
         * create new razorpay instance
         *
         *
         */
        try {
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

            const payment_capture = 1;
            const amount = GrandTotal; // amount in paisa. In our case it's INR 1
            const currency = "INR";
            const nanoId = nanoid();
            const options = {
              amount: amount,
              currency,
              payment_capture,
              notes: {
                // These notes will be added to your transaction. So you can search it within their dashboard.
                // Also, it's included in webhooks as well. So you can automate it.
                paymentFor: `${packageDetails.title} on ${selectedScheduleDate}`,
                userId: createUser.id,
                packageId: packageId,
              },
            };

            const order = await $RazorPay.orders.create(options);


            const data = {
              message: "success",
              order,
            };
            console.log(data)
            return data;
            // ==============================================================================
          }
        } catch (error) {
          if (error instanceof zodResolver) {
            console.log("Zod error");
          }
          ErrorLogger(error);
          console.log(error);
          return null
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
