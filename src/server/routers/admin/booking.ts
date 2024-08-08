import { trpc } from "@/app/_trpc/client";
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
      // console.log(scheduleId)
      try {
        const schedule = await db.schedule.findUnique({
          where: {
            id: scheduleId,
          },
        });
        // console.log("reached 1");
        if (!schedule) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Couldnt find any schedule",
          });
        }
        // console.log("reached 2");

        // console.log("pushing booking info");
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

        return data;
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
