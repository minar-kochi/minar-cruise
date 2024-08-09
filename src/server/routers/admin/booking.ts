import { trpc } from "@/app/_trpc/client";
import { MAX_BOAT_SEAT } from "@/constants/config/business";
import { db } from "@/db";
import {
  offlineBookingSchema,
  TOfflineBookingSchema,
  updateOfflineBookingSchema,
} from "@/lib/validators/offlineBookingValidator";
import { AdminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";

export const booking = router({
  updateOfflineBooking: AdminProcedure.input(
    updateOfflineBookingSchema,
  ).mutation(async ({ input, ctx }) => {
    const {
      bookingId,
      adultCount,
      advanceAmount,
      babyCount,
      billAmount,
      childCount,
      description,
      discount,
      email,
      name,
      paymentMode,
      phone,
    } = input;

    const existingId = await db.booking.count({
      where: {
        id: bookingId,
      },
    });

    if (!existingId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Booking is not found.",
      });
    }

    try {
      const data = await db.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          user: {
            update: {
              name,
              contact: phone,
              email,
            },
          },
          payment: {
            update: {
              advancePaid: advanceAmount,
              discount,
              modeOfPayment: paymentMode,
              totalAmount: billAmount,
            },
          },
          description,
          numOfAdults: adultCount,
          numOfChildren: childCount,
          numOfBaby: babyCount,
        },
      });

      if (!data) return null;
      revalidatePath("/");
      return data;
    } catch (error) {
      console.error(error);
      if (error instanceof TRPCError) {
        throw new TRPCError({ code: error.code, message: error.message });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "something went wrong",
      });
    }
  }),
  /**
   * @TODO [Amjad / Muad]
   *  -
   */
  createNewOfflineBooking: AdminProcedure.input(offlineBookingSchema).mutation(
    async ({
      input: {
        schedule: scheduleId,
        adultCount,
        advanceAmount,
        babyCount,
        billAmount,
        childCount,
        discount,
        email,
        name,
        paymentMode,
        description,
        phone,
      },
      ctx,
    }) => {
      /**
       * Check whether there is a schedule
       * if not return
       *
       *
       */
      try {
        if (!adultCount) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Couldnt find any schedule",
          });
        }
        const schedule = await db.schedule.findUnique({
          where: {
            id: scheduleId,
          },
        });
        if (!schedule) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Couldnt find any schedule",
          });
        }
        const aggregateBooking = await db.booking.aggregate({
          where: {
            scheduleId: schedule.id,
          },
          _sum: {
            numOfAdults: true,
            numOfBaby: true,
            numOfChildren: true,
          },
        });

        let AggadultCount: number = aggregateBooking._sum.numOfAdults ?? 0;
        let AggbabyCount: number = aggregateBooking._sum.numOfBaby ?? 0;
        let AggchildCount: number = aggregateBooking._sum.numOfChildren ?? 0;
        let CurrentBookingTotalSeats: number =
          adultCount + babyCount + childCount;
        let aggregateBookingSum = AggadultCount + AggbabyCount + AggchildCount;

        let sumBooking = CurrentBookingTotalSeats + aggregateBookingSum;

        if (sumBooking >= MAX_BOAT_SEAT) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Booking for total seat is filled. Extra :${sumBooking - MAX_BOAT_SEAT}`,
          });
        }
        const data = await db.booking.create({
          data: {
            schedule: {
              connect: {
                id: scheduleId,
              },
            },
            numOfAdults: adultCount,
            numOfBaby: babyCount,
            numOfChildren: childCount,
            description: description,
            user: {
              create: {
                contact: phone ?? null,
                email,
                name,
              },
            },
            payment: {
              create: {
                advancePaid: advanceAmount,
                discount: discount,
                modeOfPayment: paymentMode,
                totalAmount: billAmount,
              },
            },
          },
        });
        // console.log("reached 3");

        if (!data) {
          console.log("failed to push data");
        }
        // console.log("completed pushing");

        return { success: true };
      } catch (error) {
        console.log(error);
        if (error instanceof TRPCError) {
          throw new TRPCError({ code: error.code, message: error.message });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "something went wrong!",
        });
      }
    },
  ),
});
