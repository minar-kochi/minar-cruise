import {
  TEventType,
  TOrderBooking,
  TRazorPayEventsCreateSchedule,
  TRazorPayEventsExistingSchedule,
} from "@/Types/razorpay/type";
import { isProd, isProduction } from "../utils";
export function getNotes(
  data:
    | Omit<TRazorPayEventsExistingSchedule, "Mode">
    | Omit<TRazorPayEventsCreateSchedule, "Mode">,
): TRazorPayEventsExistingSchedule | TRazorPayEventsCreateSchedule {
  if (data.eventType === "schedule.create") {
    return {
      Mode: isProduction,
      eventType: "schedule.create",
      packageId: data.packageId,
      date: data.date,
      ScheduleTime: data.ScheduleTime,
      userId: data.userId,
      name: data.name,
      email: data.email,
      adultCount: data.adultCount,
      childCount: data.childCount,
      babyCount: data.babyCount,
    };
  }

  return {
    Mode: isProduction,
    eventType: "schedule.existing",
    packageId: data.packageId,
    scheduleId: data.scheduleId,
    userId: data.userId,
    name: data.name,
    email: data.email,
    adultCount: data.adultCount,
    childCount: data.childCount,
    babyCount: data.babyCount,
  };
}
