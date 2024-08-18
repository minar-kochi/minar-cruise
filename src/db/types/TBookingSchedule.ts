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
