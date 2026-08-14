import {
  TRazorPayEventsCreateSchedule,
  TRazorPayEventsExistingSchedule,
} from "@/Types/razorpay/type";
import { isProduction } from "../utils";
export function getNotes(
  data: TRazorPayEventsExistingSchedule | TRazorPayEventsCreateSchedule,
): TRazorPayEventsExistingSchedule | TRazorPayEventsCreateSchedule {
  if (data.eventType === "schedule.create") {
    return {
      Mode: isProduction,
      eventType: "schedule.create",
      packageId: data.packageId,
      date: data.date,
      ScheduleTime: data.ScheduleTime,
      packageTitle: data.packageTitle,
      userId: data.userId,
      name: data.name,
      email: data.email,
      adultCount: data.adultCount,
      childCount: data.childCount,
      babyCount: data.babyCount,
      bookingId: data.bookingId,
      // Spread conditionally: an explicit `undefined` would still occupy one of
      // Razorpay's 15 note slots, and the public flows must stay as they were.
      ...(data.bookingLinkId ? { bookingLinkId: data.bookingLinkId } : {}),
    };
  }

  return {
    Mode: isProduction,
    eventType: "schedule.existing",
    packageId: data.packageId,
    scheduleId: data.scheduleId,
    packageTitle: data.packageTitle,
    scheduledDate: data.scheduledDate,
    userId: data.userId,
    name: data.name,
    email: data.email,
    adultCount: data.adultCount,
    childCount: data.childCount,
    babyCount: data.babyCount,
    bookingId: data.bookingId,
    ...(data.bookingLinkId ? { bookingLinkId: data.bookingLinkId } : {}),
  };
}
