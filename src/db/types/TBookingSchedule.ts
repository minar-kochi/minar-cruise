import { $Enums } from "@prisma/client";

export type TBookingSchedule = {
  scheduleId: string;
  date: string;
  fromTime: string;
  toTime: string;
  schedulePackage: $Enums.SCHEDULED_TIME;
  bookedSeats: number;
};

export type TScheduleBooking = {
  id: string;
  day: Date;
  fromTime: string | null;
  toTime: string | null;
  schedulePackage: $Enums.SCHEDULED_TIME;
  scheduleStatus: $Enums.SCHEDULE_STATUS;
  Package: {
    id: string;
    title: string;
  } | null;
  bookedSeats: number;
};

/**
 *
 *
 * I need to get a bunch of active schedules, doesnt matter if the bookings are empty,
 * but if n number of bookings are present in a specific/single schedule,
 * i need to get only the seat count of all bookings together, with the corresponding schedule id
 *
 * @example
 *
 *  @FILTER : by date GTE today
 *
 *  schedule :{
 *      scheduleId: ....,
 *      date: ...., @FILTER
 *      fromTime: ....,
 *      toTime: .....,
 *      schedulePackage: ENUM(BF, LUNCH, DINNER, EXCLUSIVE)
 *      bookedSeats: ...., (this field is going to get data from n number of bookings which are associated to this specific schedule)
 *  }[]
 *
 *
 *
 */


export type ChangeType<T, K extends keyof T, NewType> = Omit<T, K> & {
  [P in K]: NewType;
};

export type DeepReplaceType<T, TargetType, NewType> = T extends TargetType
  ? NewType
  : T extends (infer U)[]
  ? DeepReplaceType<U, TargetType, NewType>[]
  : T extends readonly (infer U)[]
  ? readonly DeepReplaceType<U, TargetType, NewType>[]
  : T extends object
  ? {
      [K in keyof T]: DeepReplaceType<T[K], TargetType, NewType>;
    }
  : T;