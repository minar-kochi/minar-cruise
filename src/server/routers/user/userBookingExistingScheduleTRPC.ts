import { createId } from "@paralleldrive/cuid2";
import { MAX_BOAT_SEAT } from "@/constants/config/business";
import { db } from "@/db";
import { CreateUser } from "@/db/data/creator/user";
import { totalBookedSeats } from "@/db/data/dto/booking";
import { TFindPackageByIdExcludingCustomAndExclusive } from "@/db/data/dto/package";
import { findScheduleById } from "@/db/data/dto/schedule/schedule";
import { $RazorPay } from "@/lib/helpers/RazorPay";
import { calculateGSTPaise } from "@/lib/helpers/gst";
import { getTaxConfig } from "@/lib/helpers/getTaxConfig";
import { getNotes } from "@/lib/razorpay/getNotes";
import { TOnlineBookingFormValidator } from "@/lib/validators/onlineBookingValidator";
import { Schedule } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { format } from "date-fns";

/**
 * Supplied only by admin-generated booking links. When present, the fare comes
 * from the link's price snapshot instead of the live package, and
 * `amountPaise` is charged now (which is half the total for a 50% advance).
 */
export type TPricingOverride = {
  amountPaise: number;
};

export async function CreateBookingForExistingSchedule({
  input: {
    email,
    name,
    numOfAdults,
    numOfBaby,
    numOfChildren,
    phone,
    selectedScheduleDate,
  },
  packageIdExists,
  schedule,
  pricingOverride,
  extraNotes,
}: {
  input: TOnlineBookingFormValidator;
  packageIdExists: TFindPackageByIdExcludingCustomAndExclusive;
  schedule: Schedule;
  pricingOverride?: TPricingOverride;
  extraNotes?: { bookingLinkId: string };
}) {
  /**
   * Last line of defence before money changes hands. `schedule.id` is what gets
   * frozen into the Razorpay notes and what the webhook connects the Booking to,
   * and nothing downstream ever re-checks the date — so if resolution ever drifts
   * again, this is the only place left to catch it while the customer can still
   * be told. Customers have previously been charged for a schedule days away from
   * the one they picked; that must fail loudly rather than silently succeed.
   *
   * Compared in UTC on purpose: `Schedule.day` is `@db.Date` and hydrates as UTC
   * midnight, and the resolver matched it against `new Date("YYYY-MM-DD")`, which
   * is also UTC. Going through the local-time helpers here would make this assert
   * depend on the server's timezone.
   */
  const resolvedDay = schedule.day.toISOString().split("T")[0];
  if (resolvedDay !== selectedScheduleDate) {
    console.error(
      `[booking] schedule/date mismatch: schedule ${schedule.id} is ${resolvedDay}, customer selected ${selectedScheduleDate}`,
    );
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        "We couldn't confirm the date you selected, Please pick your date again before paying.",
    });
  }

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

  if (totalSeatsSelected > remainingSeats) {
    let message = "Booking is full";
    if (remainingSeats) {
      message = `Booking is almost full, We only have ${exceededSeatCount} seats left`;
    }
    `Seat Capacity exceeded by ${exceededSeatCount}, Please select a different schedule`;
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: message,
    });
  }

  /**
   * Booking links carry their own already-computed amount (from the price
   * snapshot taken when the admin generated the link), so the customer is
   * never quoted a different figure to the one agreed on the phone.
   */
  let GrandTotal: number;
  if (pricingOverride) {
    GrandTotal = pricingOverride.amountPaise;
  } else {
    const TotalAdultPrice = packageIdExists.adultPrice * numOfAdults;
    const TotalChildPrice = packageIdExists.childPrice * numOfChildren;
    const baseTotal = TotalAdultPrice + TotalChildPrice;
    const taxConfig = await getTaxConfig();
    const gst = calculateGSTPaise(baseTotal, taxConfig.gstRate);
    GrandTotal = gst.totalAmountPaise;
  }

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
  const bookingId = createId()
  console.log("id",bookingId)

  const notes = getNotes({
    eventType: "schedule.existing",
    packageId: packageIdExists.id,
    scheduleId: schedule.id,
    packageTitle: packageIdExists.title,
    scheduledDate: format(schedule.day, "dd-MM-yyyy"),
    bookingId,
    ...booking,
    ...extraNotes,
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
      email: user.email,bookingId
    };

    return data;
  } catch (error) {
    console.log(error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Failed to create Order from Razorpay Please Contact Us for booking",
    });
  }
}
