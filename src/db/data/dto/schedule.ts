import { db } from "@/db";
import { isProd } from "@/lib/utils";
import { TScheduleCreateSchema } from "@/lib/validators/ScheduleValidtor";
import {
  isStatusBreakfast,
  isStatusCustom,
  isStatusDinner,
  isStatusLunch,
} from "@/lib/validators/ScheudulePackage";
import { Schedule } from "@prisma/client";

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

  console.log(data);
  return data;
};

export type TScheduleData = Schedule;

export type TgetUpcommingScheduleDates = {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  custom: string[];
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
