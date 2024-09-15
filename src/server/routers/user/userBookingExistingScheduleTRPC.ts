import { MAX_BOAT_SEAT } from "@/constants/config/business";
import { db } from "@/db";
import { CreateUser } from "@/db/data/creator/user";
import { totalBookedSeats } from "@/db/data/dto/booking";
import { TFindPackageByIdExcludingCustomAndExclusive } from "@/db/data/dto/package";
import { findScheduleById } from "@/db/data/dto/schedule";
import { $RazorPay } from "@/lib/helpers/RazorPay";
import { getNotes } from "@/lib/razorpay/getNotes";
import { TOnlineBookingFormValidator } from "@/lib/validators/onlineBookingValidator";
import { Schedule } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export async function CreateBookingForExistingSchedule({
  input: { email, name, numOfAdults, numOfBaby, numOfChildren, phone },
  packageIdExists,
  schedule,
}: {
  input: TOnlineBookingFormValidator;
  packageIdExists: TFindPackageByIdExcludingCustomAndExclusive;
  schedule: Schedule;
}) {
  const CurrenttotalDbBookingCount = await totalBookedSeats(schedule.id);

  if (CurrenttotalDbBookingCount === -1) {
    throw new TRPCError({
      code: "TIMEOUT",
      message:
        "Sorry, We didn't get Right booking count of current schedule, Please try again.",
    });
  }

  let totalBillableCount = numOfAdults + numOfChildren;

  if (!totalBillableCount) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Total Count should be more than one",
    });
  }

  const remainingSeats = MAX_BOAT_SEAT - CurrenttotalDbBookingCount;

  const totalSeatsSelected = numOfAdults + numOfChildren + numOfBaby;
  let exceededSeatCount = totalSeatsSelected - remainingSeats;
  console.log(totalSeatsSelected);
  console.log(remainingSeats);
  console.log(exceededSeatCount);
  if (totalSeatsSelected > remainingSeats) {
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: `Seat Capacity exceeded by ${exceededSeatCount}, Please select a different schedule`,
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
    adultCount: numOfAdults,
    childCount: numOfChildren,
    babyCount: numOfBaby,
    userId: user.id,
  };
  const notes = getNotes({
    eventType: "schedule.existing",
    packageId: packageIdExists.id,
    scheduleId: schedule.id,
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
  try {
    
    const order = await $RazorPay.orders.create(options);

    const data = {
      message: "success",
      order,
      phone: user.contact,
      email:user.email
    };

    return data;
  } catch (error) {
    console.log(error)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Failed to create Order from Razorpay Please Contact Us for booking",
    });
  }
}
