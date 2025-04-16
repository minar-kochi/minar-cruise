import { db } from "@/db";
import { TScheduleBooking } from "@/db/types/TBookingSchedule";
import { isProd, RemoveTimeStampFromDate } from "@/lib/utils";
import { TScheduleCreateSchema } from "@/lib/validators/ScheduleValidtor";
import {
  isStatusBreakfast,
  isStatusDinner,
  isStatusLunch,
  isStatusSunset,
} from "@/lib/validators/Schedules";
import { $Enums, Schedule } from "@prisma/client";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";

interface ICheckScheduleStatusForTheSelectedDate {
  date: string;
  packageTime: $Enums.SCHEDULED_TIME;
}
export async function checkScheduleStatusForTheSelectedDate({
  date,
  packageTime,
}: ICheckScheduleStatusForTheSelectedDate) {
  const scheduleStatus = await db.schedule.findFirst({
    where: {
      day: new Date(date),
      // schedulePackage: packageTime,
      scheduleStatus: {
        in: ["EXCLUSIVE", "BLOCKED"],
      },
    },
    select: {
      scheduleStatus: true,
    },
  });

  return scheduleStatus;
}

export type TGetSchedulesByDateRange = Awaited<
  ReturnType<typeof getSchedulesByDateRange>
>;
export type TGetSchedulesByDateRangeExcludingNull = Exclude<
  TGetSchedulesByDateRange,
  null
>;

export async function getSchedulesByDateRange(FromDate: Date, ToDate: Date) {
  try {
    const scheduleData = await db.schedule.findMany({
      where: {
        day: {
          gte: FromDate,
          lte: ToDate,
        },
      },
      select: {
        day: true,
        schedulePackage: true,
        scheduleStatus: true,
        fromTime: true,
        toTime: true,
        Package: {
          select: {
            title: true,
            fromTime: true,
            toTime: true,
          },
        },
      },
      orderBy: {
        day: "asc",
      },
    });
    return scheduleData;
  } catch (error) {
    console.error(error);
    ErrorLogger(error);
    return null;
  }
}

export type TGetSchedulesByDateRangeWithBookingCount = Exclude<
  Awaited<ReturnType<typeof getSchedulesByDateRangeWithBookingCount>>,
  null
>;

export async function getSchedulesByDateRangeWithBookingCount(
  FromDate: Date,
  ToDate: Date,
) {
  const data = await db.schedule.findMany({
    where: {
      day: {
        gte: new Date(FromDate),
        lte: new Date(ToDate),
      },
      scheduleStatus: {
        in: ["AVAILABLE", "EXCLUSIVE"],
      },
    },
    select: {
      // id: true,
      day: true,
      fromTime: true,
      // schedulePackage: true,
      // scheduleStatus: true,
      toTime: true,
      Package: {
        select: {
          title: true,
          fromTime: true,
          toTime: true,
        },
      },
      Booking: {
        select: {
          totalBooking: true,
        },
      },
    },

    orderBy: {
      day: "asc",
    },
  });

  let scheduleBookingData = data.map((item) => ({
    ...item,
    Booking: item.Booking.reduce(
      (total, booking) => total + booking.totalBooking,
      0,
    ),
  }));

  return scheduleBookingData;
}
export async function findScheduleById(scheduleId: string) {
  try {
    const data = await db.schedule.count({
      where: {
        id: scheduleId,
      },
    });

    if (!data) return false;
    return true;
  } catch (error) {
    console.error(error);
    ErrorLogger(error);
    return false;
  }
}
export async function findScheduleToAndFrom(
  scheduleId: string,
  fromScheduleId: string,
) {
  try {
    const data = await db.schedule.findMany({
      where: {
        id: {
          in: [scheduleId, fromScheduleId],
        },
      },
      select: {
        id: true,
      },
    });

    if (!data || !data.length) return false;
    return true;
  } catch (error) {
    console.error(error);
    ErrorLogger(error);
    return false;
  }
}
/**
 * checks if the bookingId exists or not
 *
 * @param bookingId
 * @returns true | false
 */
export async function findBookingById(bookingId: string) {
  try {
    const data = await db.booking.count({
      where: {
        id: bookingId,
      },
    });
    if (!data) return false;
    return true;
  } catch (error) {
    console.error(error);
    ErrorLogger(error);
    return null;
  }
}

export type TGetSchedulePAckages = Awaited<
  ReturnType<typeof getSchedulePackages>
>;
export async function getSchedulePackages() {
  try {
    const data = await db.schedule.findMany({
      where: {
        schedulePackage: {
          in: ["BREAKFAST", "DINNER", "LUNCH"],
        },
      },
    });

    if (!data) {
      if (isProd) {
        console.log("Failed to load schedule details");
      }
      return null;
    }

    return data;
  } catch (e) {
    return null;
  }
}

export type TGetSchedule = Exclude<
  Awaited<ReturnType<typeof getSchedule>>,
  null
>;

export const getSchedule = async () => {
  const data = await db.schedule.findMany({
    where: {
      schedulePackage: "BREAKFAST",
    },
  });

  if (!data) {
    console.log("failed to fetch schedule");
    return null;
  }

  return data;
};

export type TScheduleData = Schedule;

export type TgetupComingScheduleDates = {
  breakfast: { date: string; status: $Enums.SCHEDULE_STATUS }[];
  lunch: { date: string; status: $Enums.SCHEDULE_STATUS }[];
  sunset: { date: string; status: $Enums.SCHEDULE_STATUS }[];
  dinner: { date: string; status: $Enums.SCHEDULE_STATUS }[];
  custom: { date: string; status: $Enums.SCHEDULE_STATUS }[];
};

export const getManySchedulesAndTotalBookingCount = async () => {
  try {
    const data = await db.schedule.findMany({
      where: {
        day: {
          gte: new Date(Date.now()),
        },
        scheduleStatus: {
          in: ["AVAILABLE", "EXCLUSIVE"],
        },
      },
      orderBy: {
        day: "asc",
      },
      select: {
        id: true,
        day: true,
        fromTime: true,
        schedulePackage: true,
        scheduleStatus: true,
        toTime: true,
        Package: {
          select: {
            title: true,
          },
        },
        Booking: {
          select: {
            totalBooking: true,
          },
        },
      },
    });

    let scheduleBookingData = data.map((item) => ({
      ...item,
      Booking: item.Booking.reduce(
        (total, booking) => total + booking.totalBooking,
        0,
      ),
    }));
    return scheduleBookingData;
  } catch (error) {
    console.log(error);
  }
};
export type TGetManySchedulesAndTotalBookingCount = Awaited<
  ReturnType<typeof getManySchedulesAndTotalBookingCount>
>;
export const getupComingScheduleDates = async () => {
  try {
    const data = await db.schedule.findMany({
      where: {
        day: {
          gte: new Date(Date.now()),
        },
      },
      take: 60,
    });

    let scheduledDate: TgetupComingScheduleDates = {
      breakfast: [],
      dinner: [],
      sunset: [],
      lunch: [],
      custom: [],
    };

    if (!data) {
      return null;
    }

    for (const item of data) {
      if (isStatusLunch(item.schedulePackage)) {
        scheduledDate.lunch.push({
          date: RemoveTimeStampFromDate(item.day),
          status: item.scheduleStatus,
        });
        continue;
      }
      if (isStatusSunset(item.schedulePackage)) {
        scheduledDate.sunset.push({
          date: RemoveTimeStampFromDate(item.day),
          status: item.scheduleStatus,
        });
        continue;
      }
      if (isStatusDinner(item.schedulePackage)) {
        scheduledDate.dinner.push({
          date: RemoveTimeStampFromDate(item.day),
          status: item.scheduleStatus,
        });
        continue;
      }
      if (isStatusBreakfast(item.schedulePackage)) {
        scheduledDate.breakfast.push({
          date: RemoveTimeStampFromDate(item.day),
          status: item.scheduleStatus,
        });
        continue;
      }
      scheduledDate.custom.push({
        date: RemoveTimeStampFromDate(item.day),
        status: item.scheduleStatus,
      });
    }
    return scheduledDate;
  } catch (error) {
    console.log("ERROR TRACE-: schedule.ts", "\n", error);
    return null;
  }
};

export const getScheduleByDayOrStatus = async ({
  ScheduleDate,
  ScheduleTime,
  packageId,
}: TScheduleCreateSchema) => {
  return await db.schedule.findFirst({
    where: {
      AND: [
        {
          day: new Date(ScheduleDate),
          OR: [
            {
              packageId,
            },
            {
              schedulePackage: ScheduleTime,
            },
          ],
        },
      ],
    },
  });
};

export const getSchedulesByDateOrNow = async (ScheduleDate: string) => {
  const schedule = await db.schedule.findMany({
    where: {
      day: new Date(ScheduleDate),
    },
  });

  if (schedule.length < 0) {
    return null;
  }
  return schedule;
};

export type TGetAllSchedules = Awaited<ReturnType<typeof getAllSchedules>>;

export const getAllSchedules = async () => {
  try {
    const schedules = await db.schedule.findMany({
      where: {
        day: {
          gte: new Date(Date.now()),
        },
      },
      select: {
        id: true,
        day: true,
        toTime: true,
        fromTime: true,
        schedulePackage: true,
        scheduleStatus: true,
        Package: {
          select: {
            title: true,
          },
        },
        Booking: {
          select: {
            id: true,
            numOfAdults: true,
            numOfBaby: true,
            numOfChildren: true,
          },
        },
      },
    });

    // type TFormattedSchedules ={
    //   fromTime: string | null;
    //   toTime: string | null;
    //   id: string;
    //   day: Date;
    //   schedulePackage: string;
    //   scheduleStatus: string;
    //   Package: {
    //       id: string,
    //       description: string
    //   } | null;
    //   childCount: number
    //   adultCount: number
    //   babyCount: number
    // }[]

    // const formattedSchedules: TFormattedSchedules = [];
    // for(let i = 0 ; i < schedules.length; i++){
    //   let formattedCount = 0;
    //   for(let j = 0; j< schedules[i].Booking.length; j++ ){
    //     const temp = schedules[i].Booking[j].numOfAdults + schedules[i].Booking[j].numOfChildren + schedules[i].Booking[j].numOfBaby;
    //     formattedCount += temp
    //     j++
    //   }
    //   formattedSchedules.push({

    //   })
    //   i++
    // }

    if (!schedules) return null;
    return schedules;
  } catch (error) {
    console.log("failed to fetch all schedules", error);
    return null;
  }
};

export const getSchedulesAndBookingByDate = async () => {
  const schedules = await db.schedule.findMany({
    where: {
      day: {
        gte: new Date(Date.now()),
      },
    },
    select: {
      day: true,
      toTime: true,
      schedulePackage: true,
      scheduleStatus: true,
      id: true,

      fromTime: true,
      Package: {
        select: {
          id: true,
          title: true,
        },
      },
      Booking: {
        select: {
          numOfAdults: true,
          numOfBaby: true,
          numOfChildren: true,
        },
      },
    },
  });
  if (!schedules) {
    return null;
  }
  const formattedData: TScheduleBooking[] = [];
  for (const schedule of schedules) {
    let bookedSeats = 0;
    let { Booking, ...rest } = schedule;
    Booking.forEach((value) => {
      bookedSeats = value.numOfAdults + value.numOfBaby + value.numOfChildren;
    });
    formattedData.push({
      ...rest,
      bookedSeats: bookedSeats,
    });
  }
  return formattedData;
};
export type TGetBookingsByScheduleId = Awaited<
  ReturnType<typeof getBookingsByScheduleId>
>;

export async function getBookingsByScheduleId(id: string) {
  try {
    const data = await db.booking.findMany({
      where: {
        scheduleId: id,
      },
      select: {
        id: true,
        createdAt: true,
        description: true,
        numOfAdults: true,
        numOfBaby: true,
        numOfChildren: true,
        user: {
          select: {
            id: true,
            contact: true,
            email: true,
            name: true,
          },
        },
        schedule: {
          select: {
            schedulePackage: true,
            day: true
          },
        },
        payment: {
          select: {
            advancePaid: true,
            discount: true,
            totalAmount: true,
            modeOfPayment: true,
          },
        },
      },
    });
    if (!data) {
      return null;
    }
    return data;
  } catch (error) {
    console.log("failed to fetch all booking of specific id", error);
    return null;
  }
}
