import { db } from "@/db";
import { isProd } from "@/lib/utils";
import { TScheduleCreateSchema } from "@/lib/validators/ScheduleValidtor";
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

// export type TScheduleData = Omit<Schedule, "day"> & { day: string | Date };
export type TScheduleData = Schedule;

export type TgetUpcommingScheduleDates = {
  BreakFast: Date[];
  Lunch: Date[];
  Dinner: Date[];
};

export const getUpcommingScheduleDates = async () => {
  const data = await db.schedule.findMany({
    where: {
      day: {
        gte: new Date(Date.now()),
      },
    },
    take: 15,
  });

  let scheduledDate: TgetUpcommingScheduleDates = {
    BreakFast: [],
    Dinner: [],
    Lunch: [],
  };

  if (!data) {
    console.log("failed to fetch schedule");
    return null;
  }

  for (const item of data) {
    if (item.schedulePackage === "LUNCH") {
      scheduledDate.Lunch.push(item.day);
      continue;
    }
    if (item.schedulePackage === "DINNER") {
      scheduledDate.Dinner.push(item.day);
      continue;
    }
    scheduledDate.Lunch.push(item.day);
  }
  return scheduledDate;
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
