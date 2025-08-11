import { $Enums, Events } from "@prisma/client";

export type TOrderEvent<T> = {
  events: Events;
  //type is any because of Razorpay doesn't actually give out types.
  orderBody: T;
};
export type TEventType = {
  "schedule.existing": "schedule.existing";
  "schedule.create": "schedule.create";
};

export type TMode = {
  Mode?: "production" | "development";
};
export type TRazorPayEventsExistingSchedule = {
  eventType: TEventType["schedule.existing"];
  packageId: string;
  scheduleId: string;
  packageTitle: string;
  scheduledDate: string;
} & TOrderBooking &
  TMode;

export type TRazorPayEventsCreateSchedule = {
  eventType: TEventType["schedule.create"];
  packageId: string;
  date: string;
  ScheduleTime: $Enums.PACKAGE_CATEGORY;
  packageTitle: string;
} & TOrderBooking &
  TMode;

export type TOrderBooking = {
  bookingId:string;
  userId: string;
  name: string;
  email: string;
  adultCount: number;
  childCount: number;
  babyCount: number;
};
