import { db } from "@/db";
import { TScheduleBooking } from "@/db/types/TBookingSchedule";
import { isProd } from "@/lib/utils";
import { TScheduleCreateSchema } from "@/lib/validators/ScheduleValidtor";
import {
  isStatusBreakfast,
  isStatusCustom,
  isStatusDinner,
  isStatusLunch,
} from "@/lib/validators/Schedules";
import { TScheduleWithBookingCountWithId } from "@/Types/Schedule/ScheduleSelect";
import { Schedule } from "@prisma/client";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";

/**
 * checks if the bookingId exists or not
 *
 * @param scheduleId
 * @returns true | false
 */

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
        schedulePackage: "BREAKFAST" || "DINNER" || "LUNCH",
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

export type TgetUpcommingScheduleDates = {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  custom: string[];
};

export const getManySchedulesAndTotalBookingCount = async () => {
  try {
    const data = await db.schedule.findMany({
      where: {
        day: {
          gte: new Date(Date.now()),
        },
        scheduleStatus: {
          in: ["AVAILABLE","EXCLUSIVE"]
        }
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

export const getUpcommingScheduleDates = async () => {
  try {
    const data = await db.schedule.findMany({
      where: {
        day: {
          gte: new Date(Date.now()),
        },
      },
      take: 60,
    });

    let scheduledDate: TgetUpcommingScheduleDates = {
      breakfast: [],
      dinner: [],
      lunch: [],
      custom: [],
    };

    if (!data) {
      return null;
    }

    for (const item of data) {
      if (isStatusLunch(item.schedulePackage)) {
        scheduledDate.lunch.push(
          item.day.toLocaleDateString(undefined, { timeZone: "Asia/Kolkata" }),
        );
        continue;
      }
      if (isStatusDinner(item.schedulePackage)) {
        scheduledDate.dinner.push(
          item.day.toLocaleDateString(undefined, { timeZone: "Asia/Kolkata" }),
        );
        continue;
      }
      if (isStatusBreakfast(item.schedulePackage)) {
        scheduledDate.breakfast.push(
          item.day.toLocaleDateString(undefined, { timeZone: "Asia/Kolkata" }),
        );
        continue;
      }
      scheduledDate.custom.push(
        item.day.toLocaleDateString(undefined, { timeZone: "Asia/Kolkata" }),
      );
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
