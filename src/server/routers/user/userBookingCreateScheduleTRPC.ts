import { MIN_NEW_BOOKING_COUNT } from "@/constants/config/business";
import { CreateUser } from "@/db/data/creator/user";
import { TFindPackageByIdExcludingCustomAndExclusive } from "@/db/data/dto/package";
import { $RazorPay } from "@/lib/helpers/RazorPay";
import { getNotes } from "@/lib/razorpay/getNotes";
import { checkBookingTimeConstraint } from "@/lib/utils";
import { TOnlineBookingFormValidator } from "@/lib/validators/onlineBookingValidator";
import { isStatusSunset } from "@/lib/validators/Schedules";
import { $Enums } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export async function CreateBookingForCreateSchedule({
  input: {
    email,
    name,
    numOfAdults,
    numOfBaby,
    numOfChildren,
    selectedScheduleDate,
    phone,
  },
  scheduleTime,
  packageIdExists,
}: {
  input: TOnlineBookingFormValidator;
  packageIdExists: TFindPackageByIdExcludingCustomAndExclusive;
  scheduleTime: $Enums.SCHEDULED_TIME;
}) {
  /**
   * To generate the event we need certain condition to be met.
   * 1. Total condition should be 25. [done]
   * 2. Event should be not blocked or exclusive or it must be Sunset cruise with not an exclusive package.
   *              - [Checked on Hoisted Level that The schedule Date] [done]
   * 3. Date must be validated. [InProgress]
   * 4. Schedule timing should be either booked before the certain business condition timing [done]
   * 5. Schedule timing should not be CUSTOM / Exclusive. [done]
   * 6. Schedule CreateSchedule Should not be Sunset. [Done]
   * 7.
   *
   */

  //This error wont trigger, unless you are missing some checks above.
  // if (isStatusSunset(scheduleTime)) {
  //   throw new TRPCError({
  //     code: "BAD_REQUEST",
  //     message:
  //       "Something went wrong, Sunset cruise shouldn't be on this Route.",
  //   });
  // }

  const totalCount = numOfAdults + numOfChildren;

  if (!isStatusSunset(scheduleTime)) {
    if (totalCount < MIN_NEW_BOOKING_COUNT) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Count Should of minimum ${MIN_NEW_BOOKING_COUNT}, for a new created schedule`,
      });
    }
  }
  if (totalCount < 1) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Count Should of minimum 1, for a Sunset Schedule",
    });
  }
  const bookingRequestCameBeforeTimeConstraint = checkBookingTimeConstraint({
    selectedDate: selectedScheduleDate,
    startFrom: packageIdExists.fromTime,
    scheduleTime,
  });

  if (!bookingRequestCameBeforeTimeConstraint) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        "Could not complete booking as it is too late for selected date, please select a different package or date",
    });
  }
  const TotalAdultPrice = packageIdExists.adultPrice * numOfAdults;
  const TotalChildPrice = packageIdExists.childPrice * numOfChildren;
  const GrandTotal = TotalAdultPrice + TotalChildPrice;
  if (GrandTotal <= 0) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "We couldn't fetch the details for the pricing..",
    });
  }
  const user = await CreateUser({
    email,
    name,
    phone,
  });

  if (!user?.id) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to add in user Details, Please try again",
    });
  }

  let booking = {
    name: name,
    email: email,
    userId: user.id,
    adultCount: numOfAdults,
    childCount: numOfChildren,
    babyCount: numOfBaby,
  };
  const notes = getNotes({
    eventType: "schedule.create",
    date: selectedScheduleDate,
    ScheduleTime: scheduleTime,
    packageId: packageIdExists.id,
    ...booking,
  });
  const payment_capture = 1;
  const amount = GrandTotal;
  const currency = "INR";
  const options = {
    amount,
    currency,
    payment_capture,
    notes,
  };
  const order = await $RazorPay.orders.create(options);
  const data = {
    message: "success",
    order,
    phone: user.contact,
    email: user.email,
  };

  return data;
}
