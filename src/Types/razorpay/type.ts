import { $Enums, Events } from "@prisma/client";

export type TOrderEvent<T> = {
  events: Events;
  //type is any because of Razorpay doesn't actually give out types.
  orderBody: T;
};

export type TRazorPayEventsExistingSchedule = {
  eventType: "schedule.existing";
  packageId: string;
  userId: string;
  scheduleId: string;
} & TOrderBooking;

export type TRazorPayEventsCreateSchedule = {
  eventType: "schedule.create";
  packageId: string;
  userId: string;
  date: string;
  ScheduleTime: typeof $Enums.PACKAGE_CATEGORY
} & TOrderBooking;

export type TOrderBooking = {
  name: string;
  email: string;
  adultCount: number;
  childCount: number;
  babyCount: number;
};
