import { BookingConfirmationEmailForAdmin } from "@/components/services/BookingConfirmationEmailForAdmin";
import EmailSendBookingConfirmation from "@/components/services/EmailService";
import { INFINITE_QUERY_LIMIT } from "@/constants/config";
import { MAX_BOAT_SEAT } from "@/constants/config/business";
import { db } from "@/db";
import {
  BookingSchedulesTotalCounts,
  BookingTotalCount,
} from "@/db/data/dto/booking";
import {
  findBookingById,
  findScheduleById,
  findScheduleToAndFrom,
  getRecentBookings,
  getScheduleWithBookingCount,
} from "@/db/data/dto/schedule";
import { sendConfirmationEmail } from "@/lib/helpers/resend";
import {
  combineDateWithSplitedTime,
  RemoveTimeStampFromDate,
  sleep,
  splitTimeColon,
} from "@/lib/utils";
import { updateScheduleIdOfBooking } from "@/lib/validators/Booking";
import {
  offlineBookingFormSchema,
  updateOfflineBookingSchema,
} from "@/lib/validators/offlineBookingValidator";
import { AdminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const booking = router({
  deleteBooking: AdminProcedure.input(
    z.object({
      bookingId: z.string(),
    }),
  ).mutation(async ({ input: { bookingId } }) => {
    try {
      const bookingExists = await findBookingById(bookingId);
      if (!bookingExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "booking id doesn't exists",
        });
      }
      await db.booking.delete({
        where: {
          id: bookingId,
        },
      });
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
  transferAllBookingsToASpecificSchedule: AdminProcedure.input(
    z.object({
      fromScheduleId: z.string(),
      toScheduleId: z.string(),
    }),
  ).mutation(async ({ input: { fromScheduleId, toScheduleId }, ctx }) => {
    try {
      /**
       * check if both scheduleId  exists in db, if not Throw trpc error
       * take the count of all seats of the from and to schedule id's
       * then check if the ToSchedule is
       *    - 150
       *    -  or take the count of seats left
       * then check if the fromSchedule is
       *    - has no more than 150 seats
       *    - has min at least one booking or one booking , if no bookings came then return null
       *    - and take total count of seats that needs to be moved to another schedule
       * then compare if the total number of seats from schedule id that can be transferred to next schedule
       *  and make sure the seats do not go beyond max capacity, if not return error
       *
       */

      // ---------------------Checking Both scheduleId --------------------------

      if (fromScheduleId === toScheduleId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot move bookings to that same package",
        });
      }

      // ---------------------Checking Schedule ID STARTS--------------------------

      // checks if fromSchedules exists in db

      const scheduleFound = await findScheduleToAndFrom(
        fromScheduleId,
        toScheduleId,
      );

      if (!scheduleFound) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Schedules not found.",
        });
      }

      // ---------------------Checking Schedule ID  ENDS--------------------------

      //----------------------Checking Seat count of both schedules START----------------------

      // checks the count of all fromSchedules booking

      const AllCountOfFromSchedule =
        await BookingSchedulesTotalCounts(fromScheduleId);

      if (!AllCountOfFromSchedule || !AllCountOfFromSchedule?.length) {
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: "Schedule to move doesn't have a booking",
        });
      }

      let totalSeatsOfFromSchedules = AllCountOfFromSchedule.reduce(
        (total, booking) => total + booking.totalBooking,
        0,
      );

      if (!totalSeatsOfFromSchedules) {
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: "Cannot move a schedule that has no bookings",
        });
      }

      // checks the count of all toSchedules booking

      const AllCountOfToSchedule = await db.booking.findMany({
        where: {
          scheduleId: toScheduleId,
        },
        select: {
          totalBooking: true,
        },
      });

      if (!AllCountOfToSchedule) {
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message: "Couldn't get count of all bookings from schedule",
        });
      }

      let totalSeatsOfToSchedules = AllCountOfToSchedule.reduce(
        (total, booking) => total + booking.totalBooking,
        0,
      );

      //----------------------Checking Seat count of both schedules ENDS----------------------

      //----------------------Comparing Seat count of both schedules STARTS----------------------

      if (totalSeatsOfToSchedules === MAX_BOAT_SEAT) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Max seats occupied, Cannot add new seats",
        });
      }

      if (totalSeatsOfFromSchedules > MAX_BOAT_SEAT) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot fill seats greater than max capacity",
        });
      }
      if (totalSeatsOfFromSchedules + totalSeatsOfToSchedules > MAX_BOAT_SEAT) {
        let exceededCap =
          totalSeatsOfFromSchedules + totalSeatsOfToSchedules - MAX_BOAT_SEAT;
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot move bookings, Total seat count may exceed maximum capacity by ${exceededCap}`,
        });
      }

      //----------------------Comparing Seat count of both schedules ENDS----------------------

      const data = await db.$transaction(async (tx) => {
        let updates = await tx.booking.updateMany({
          where: {
            scheduleId: fromScheduleId,
          },
          data: {
            scheduleId: toScheduleId,
          },
        });
        return updates;
      });

      if (!data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: "ScheduleId",
          message: "Couldn't update bookings with the given id",
        });
      }

      return data;
    } catch (error) {
      console.error(error);
      if (error instanceof TRPCError) {
        throw new TRPCError({ code: error.code, message: error.message });
      }

      throw new TRPCError({
        code: "BAD_GATEWAY",
        message: "something went wrong",
      });
    }
  }),

  changeBookingSchedule: AdminProcedure.input(
    updateScheduleIdOfBooking,
  ).mutation(
    async ({ input: { idOfBookingToBeUpdated, toScheduleId }, ctx }) => {
      try {
        //-----------------Checks if given ID exists in db STARTS-----------------------------
        const fromScheduleIdExists = await findScheduleById(toScheduleId);

        if (!fromScheduleIdExists) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not find from schedule id",
          });
        }

        const BookingIdExists = await findBookingById(idOfBookingToBeUpdated);

        if (!BookingIdExists) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could not find booking id",
          });
        }
        //-----------------Checks if given ID exists in db ENDS-----------------------------

        //-----------------CHecking Count of the given booking id STARTS-----------------------------

        const totalSeatsOfBooking = await BookingTotalCount(
          idOfBookingToBeUpdated,
        );

        if (!totalSeatsOfBooking) {
          throw new TRPCError({
            code: "BAD_GATEWAY",
            message: "Could get any seat count in the booking id",
          });
        }

        //-----------------CHecking Count of the given booking id END-----------------------------

        //-----------------CHecking Count of the given scheduleID STARTS-----------------------------

        const unformattedScheduleCount =
          await BookingSchedulesTotalCounts(toScheduleId);

        if (!unformattedScheduleCount) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Could find schedule count",
          });
        }

        let totalCountOfToScheduleId = unformattedScheduleCount.reduce(
          (total, booking) => total + booking.totalBooking,
          0,
        );

        //-----------------CHecking Count of the given scheduleID ENDS-----------------------------

        //-----------------CHecking if the seats does not surpass max capacity STARTS-----------------------------
        if (totalSeatsOfBooking.totalBooking > MAX_BOAT_SEAT) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Total passengers cannot surpass max capacity",
          });
        }
        if (totalCountOfToScheduleId >= MAX_BOAT_SEAT) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "The selected schedule is at maximum capacity, cannot add more passengers",
          });
        }

        if (
          totalCountOfToScheduleId + totalSeatsOfBooking.totalBooking >
          MAX_BOAT_SEAT
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Cannot add passengers to the selected schedule, Count Exceeds max capacity of the boat",
          });
        }
        //-----------------CHecking if the seats does not surpass max capacity ENDS-----------------------------

        const data = await db.booking.update({
          where: {
            id: idOfBookingToBeUpdated,
          },
          data: {
            scheduleId: toScheduleId,
          },
        });

        if (!data) return null;

        return data.scheduleId;
      } catch (error) {
        console.log(error);
        if (error instanceof TRPCError) {
          throw new TRPCError({ code: error.code, message: error.message });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong, Please try again",
        });
      }
    },
  ),

  updateOfflineBooking: AdminProcedure.input(
    updateOfflineBookingSchema,
  ).mutation(async ({ input, ctx }) => {
    const {
      schedule,
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
    // @TODO @HOTFIX need to check the total count before updating booking
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

    /**
     * check if booking id exists
     *
     * check min 1 adult count
     *
     * check total count of booking that it already had
     *
     * check total count of booking that is being updated
     *
     * check the total seat count of the current schedule in which the booking is going to be updated
     *
     * should return error - if  the total seat count of the booking  exceeds maximum capacity
     *     in the specific schedule that is going to be updated
     *
     */
    // @TODO @HOTFIX need to check the total count before updating booking
    try {
      //-------------checks if booking exists in DB STARTS------------------------
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
      //-------------checks if booking exists in DB ENDS------------------------

      //-------------checks adult has min count STARTS------------------------
      let minCap = adultCount + childCount;
      if (!minCap) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Need at least 1 adult to update booking",
        });
      }
      //-------------checks adult has min count END------------------------

      //-------------Takes all the updated count STARTS------------------------

      const seatCountBeforeUpdate = await db.booking.findUnique({
        where: {
          id: bookingId,
        },
        select: {
          totalBooking: true,
        },
      });

      if (!seatCountBeforeUpdate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Could not get existing booking count",
        });
      }
      const updatedSeatCountOfBooking = adultCount + childCount + babyCount;

      if (updatedSeatCountOfBooking < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot update booking where count is less than 1",
        });
      }

      if (updatedSeatCountOfBooking > MAX_BOAT_SEAT) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Cannot update booking where total count exceeds max capacity",
        });
      }
      //-------------Takes all the updated count ENDS------------------------

      //-------------checks total count of booking associated with schedule STARTS------------------------
      const totalCountOfSchedule = await db.booking.findMany({
        where: {
          scheduleId: schedule,
        },
        select: {
          totalBooking: true,
        },
      });

      if (!totalCountOfSchedule) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Couldn't get total seat count of schedule",
        });
      }

      const formattedTotalCountOfSchedule = totalCountOfSchedule.reduce(
        (total, booking) => total + booking.totalBooking,
        0,
      );
      //-------------checks total count of booking associated with schedule ENDS------------------------

      //-------------checks if updated seats exceeds max capacity STARTS------------------------
      // if (
      //   seatCountBeforeUpdate.totalBooking -
      //     updatedSeatCountOfBooking +
      //     formattedTotalCountOfSchedule >
      //   MAX_BOAT_SEAT
      // ) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Cannot update booking, as the updated count exceeds max capacity"
      //   })
      // }

      if (
        updatedSeatCountOfBooking +
          (formattedTotalCountOfSchedule - seatCountBeforeUpdate.totalBooking) >
        MAX_BOAT_SEAT
      ) {
        throw new TRPCError({
          code: "BAD_GATEWAY",
          message:
            "Cannot update booking, as the updated count exceeds max capacity",
        });
      }
      //-------------checks if updated seats exceeds max capacity ENDS------------------------

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

  createNewOfflineBooking: AdminProcedure.input(
    offlineBookingFormSchema,
  ).mutation(
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

        let AggAdultCount: number = aggregateBooking._sum.numOfAdults ?? 0;
        let AggBabyCount: number = aggregateBooking._sum.numOfBaby ?? 0;
        let AggChildCount: number = aggregateBooking._sum.numOfChildren ?? 0;
        let CurrentBookingTotalSeats: number =
          adultCount + babyCount + childCount;
        let aggregateBookingSum = AggAdultCount + AggBabyCount + AggChildCount;

        let sumBooking = CurrentBookingTotalSeats + aggregateBookingSum;

        if (sumBooking > MAX_BOAT_SEAT) {
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
  resendConfirmationEmail: AdminProcedure.input(
    z.object({
      bookingId: z.string({
        message: "Booking id is required",
      }),
    }),
  ).mutation(async ({ ctx, input }) => {
    const bookingId = input.bookingId;
    const booking = await db.booking.findFirst({
      where: {
        id: bookingId,
      },
      select: {
        createdAt: true,
        id: true,
        scheduleId: true,
        numOfAdults: true,
        numOfBaby: true,
        numOfChildren: true,
        description: true,
        user: {
          select: {
            contact: true,
            email: true,
            id: true,
            name: true,
          },
        },
        schedule: {
          select: {
            day: true,
            Package: {
              select: {
                title: true,
                duration: true,
              },
            },
          },
        },
        payment: {
          select: {
            advancePaid: true,
            discount: true,
            id: true,
            modeOfPayment: true,
            totalAmount: true,
          },
        },
      },
    });
    if (!booking?.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Unable to find booking",
      });
    }
    if (!booking.user.email) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Email not found for the user.",
      });
    }
    const bookedPackage = booking.schedule.Package;
    const payment = booking.payment;
    let duration = `${bookedPackage?.duration ? bookedPackage?.duration / 60 : "--"} Hr`;
    let isAdminMessageFailed: boolean = false;
    const adminEmailResponse = sendConfirmationEmail({
      recipientEmail: process.env.ADMIN_EMAIL!,
      fromEmail: process.env.NEXT_PUBLIC_BOOKING_EMAIL!,
      emailSubject: "Minar: New Booking Received",
      emailComponent: BookingConfirmationEmailForAdmin({
        scheduleId: booking.scheduleId,
        Name: booking.user.name,
        adultCount: booking.numOfAdults,
        babyCount: booking.numOfBaby,
        childCount: booking.numOfChildren,
        BookingDate: format(
          RemoveTimeStampFromDate(booking.createdAt),
          "dd-MM-yyyy",
        ),
        email: booking.user.email,
        phone: booking.user.contact ?? "",
        BookingId: booking.id,
        packageTitle: bookedPackage?.title ?? "",
        scheduleDate: booking.schedule?.day
          ? format(booking.schedule?.day, "dd-MM-yyyy")
          : "--",
        totalAmount: payment.totalAmount,
      }),
    });

    if (!adminEmailResponse || adminEmailResponse === null) {
      isAdminMessageFailed = true;
    }
    if ("error" in adminEmailResponse) {
      isAdminMessageFailed = true;
    }

    const emailResponse = await sendConfirmationEmail({
      fromEmail: process.env.NEXT_PUBLIC_BOOKING_EMAIL!,
      recipientEmail: [booking.user.email, process.env.ADMIN_EMAIL!],
      emailSubject: "Minar: Your Booking has Confirmed",
      emailComponent: EmailSendBookingConfirmation({
        duration,
        packageTitle: `${bookedPackage?.title ?? "--"} `,
        status: "Confirmed",
        totalAmount: payment.totalAmount,
        totalCount:
          booking.numOfAdults + booking.numOfBaby + booking.numOfChildren,
        BookingId: booking.id,
        customerName: booking.user.name,
        date: booking.schedule?.day
          ? format(booking.schedule.day, "dd-MM-yyyy")
          : "--",
      }),
    });

    if (!emailResponse || emailResponse === null) {
      throw new TRPCError({
        code: "SERVICE_UNAVAILABLE",
        message: "Failed to send email, service error",
      });
    }
    if ("error" in emailResponse) {
      throw new TRPCError({
        message: "Failed to send email",
        code: "SERVICE_UNAVAILABLE",
      });
    }
    return {
      success: emailResponse,
      isAdminFailed: isAdminMessageFailed,
    };
  }),

  getRecentBookingsInfinity: AdminProcedure.input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
      search: z.string().optional(),
    }),
  ).query(async ({ ctx, input }) => {
    const { cursor } = input;
    const limit = input.limit ?? INFINITE_QUERY_LIMIT;
    const search = input.search;
    const data = await getRecentBookings({ cursor, limit, search });

    let nextCursor: typeof cursor | undefined = undefined;
    if (data.length > limit) {
      const nextItem = data.pop();
      nextCursor = nextItem?.id;
    }
    return {
      response: data,
      nextCursor,
    };
  }),

  bookingScheduleInfinity: AdminProcedure.input(
    z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
  ).query(async ({ ctx, input }) => {
    const { cursor } = input;
    const limit = input.limit ?? INFINITE_QUERY_LIMIT;

    const data = await getScheduleWithBookingCount({ limit, cursor });

    try {
      data.sort((a, b) => {
        let Atime = splitTimeColon(a.fromTime ?? a.Package?.fromTime ?? "");
        let Btime = splitTimeColon(b.fromTime ?? b.Package?.fromTime ?? "");

        if (!Btime || !Atime) return 0;

        let ADate = combineDateWithSplitedTime(a.day, Atime);
        let BDate = combineDateWithSplitedTime(b.day, Btime);
        return ADate.getTime() - BDate.getTime();
      });
    } catch (error) {
      console.log(error);
    }
    let nextCursor: typeof cursor | undefined = undefined;

    let scheduleBookingData = data.map((item) => ({
      ...item,
      Booking: item.Booking.reduce(
        (total, booking) => total + booking.totalBooking,
        0,
      ),
    }));
    if (data.length > limit) {
      const nextItem = scheduleBookingData.pop();
      nextCursor = nextItem?.id;
    }
    return {
      response: scheduleBookingData,
      nextCursor,
    };
  }),
});
