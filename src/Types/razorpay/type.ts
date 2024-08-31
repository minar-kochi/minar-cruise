import { Events } from "@prisma/client";

export type TOrderEvent<T> = {
  events: Events;
  //type is any because of Razorpay doesn't actually give out types.
  orderBody: T;
};

export type TRazorPayEventsExistingSchedule = {
  eventType: "schedule.existing";
  packageId: string;
  userId:string;
  scheduleId: string;
  name: string;
  email: string;
  adultCount: number;
  childCount: number;
  babyCount: number;
};
