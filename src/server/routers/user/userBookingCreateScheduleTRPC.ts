import { CreateUser } from "@/db/data/creator/user";
import { TFindPackageByIdExcludingCustomAndExclusive } from "@/db/data/dto/package";
import { $RazorPay } from "@/lib/helpers/RazorPay";
import { calculateGSTPaise } from "@/lib/helpers/gst";
import { getTaxConfig } from "@/lib/helpers/getTaxConfig";
import { getBookingConfig } from "@/lib/helpers/config/getBookingConfig";
import { resolvePackageBookingRule } from "@/lib/config/bookingConfig.types";
import { getNotes } from "@/lib/razorpay/getNotes";
import { isWithinBookingWindow, istInstant, parseIstDayKey } from "@/lib/datetime";
import { TOnlineBookingFormValidator } from "@/lib/validators/onlineBookingValidator";
import { createId } from "@paralleldrive/cuid2";
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
  pricingOverride,
  extraNotes,
  skipMinimumCountCheck = false,
}: {
  input: TOnlineBookingFormValidator;
  packageIdExists: TFindPackageByIdExcludingCustomAndExclusive;
  scheduleTime: $Enums.SCHEDULED_TIME;
  /** Booking links carry their own snapshotted amount. */
  pricingOverride?: { amountPaise: number };
  extraNotes?: { bookingLinkId: string };
  /**
   * Booking links may go below MIN_NEW_BOOKING_COUNT: an admin issuing one has
   * already authorised the sale over the phone, so the 30-guest floor for a
   * brand-new schedule would only block a legitimate booking. The lead-time
   * gate below still applies — the galley needs notice either way.
   */
  skipMinimumCountCheck?: boolean;
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

  // Rules are per package now, resolved against the site-wide defaults. A
  // package resolving to `null` has no party-size floor; Sunset is seeded with
  // `minNewBookingCount: 0` to get that, which is what the hardcoded
  // `isStatusSunset` check used to encode. A package that leaves the column
  // unset inherits the 30-guest default instead.
  const bookingRule = resolvePackageBookingRule(
    packageIdExists,
    await getBookingConfig(),
  );
  const minNewBookingCount = bookingRule.minNewBookingCount;

  if (minNewBookingCount !== null && !skipMinimumCountCheck) {
    if (totalCount < minNewBookingCount) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Count Should of minimum ${minNewBookingCount}, for a new created schedule`,
      });
    }
  }
  if (totalCount < 1) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Count Should of minimum 1, for a Sunset Schedule",
    });
  }

  /**
   * The boat's capacity. This path creates the schedule, so there are no
   * existing bookings to subtract — the party alone has to fit.
   *
   * `CreateBookingForExistingSchedule` has always checked this against the
   * seats already sold; this path relied on the tRPC input schema's hardcoded
   * `.max(150)` instead, which stopped being a real limit once `maxBoatSeat`
   * became admin-editable and the schema was relaxed to a sanity ceiling.
   */
  const totalSeatsSelected = numOfAdults + numOfChildren + numOfBaby;
  if (totalSeatsSelected > bookingRule.maxBoatSeat) {
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: `We can only seat ${bookingRule.maxBoatSeat} guests, please reduce the number of seats`,
    });
  }
  /**
   * The lead-time gate. This is the create-schedule path, so there is no
   * Schedule row yet — the departure is derived from the package's IST
   * time-of-day for the date the customer picked, by the same helper the
   * schedule itself will be written with, so the instant checked here is the
   * instant that ends up stored.
   */
  const selectedDay = parseIstDayKey(selectedScheduleDate);
  const departsAt =
    selectedDay && packageIdExists.startMinutesIst !== null
      ? istInstant(selectedDay, packageIdExists.startMinutesIst)
      : null;

  if (!departsAt) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        "Could not determine the departure time for that date, please pick a different date or package",
    });
  }

  const bookingRequestCameBeforeTimeConstraint = isWithinBookingWindow({
    departsAt,
    minLeadTimeHours: bookingRule.minLeadTimeHours,
  });

  if (!bookingRequestCameBeforeTimeConstraint) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        "Could not complete booking as it is too late for selected date, please select a different package or date",
    });
  }
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
  const bookingId = createId();
  console.log("id", bookingId);
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
    packageTitle: packageIdExists.title,
    date: selectedScheduleDate,
    ScheduleTime: scheduleTime,
    packageId: packageIdExists.id,
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
  const order = await $RazorPay.orders.create(options);
  const data = {
    message: "success",
    order,
    phone: user.contact,
    email: user.email,
    bookingId,
  };

  return data;
}
