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
  bookingId: string;
  userId: string;
  name: string;
  email: string;
  adultCount: number;
  childCount: number;
  babyCount: number;
  /**
   * Present only on admin-generated booking-link orders; the public /search and
   * /package flows omit it entirely.
   *
   * Deliberately on the shared TOrderBooking rather than on each event type:
   * handle-order.ts rewrites a `schedule.create` order into `schedule.existing`
   * via `getNotes({ ..., ...rest })` when the schedule turns out to exist, and
   * living here means the id survives that re-spread instead of being silently
   * dropped.
   *
   * Razorpay caps notes at 15 key/value pairs; this is the 14th.
   */
  bookingLinkId?: string;
};
