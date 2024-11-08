import { db } from "@/db";
import { $Enums } from "@prisma/client";

export async function CreateSchedule({
  date,
  packageId,
  scheduleTimeForPackage,
  scheduleStatus,
}: {
  packageId: string;
  date: string;
  scheduleTimeForPackage: $Enums.SCHEDULED_TIME;
  scheduleStatus: $Enums.SCHEDULE_STATUS;
}) {
  try {
    const createSchedule = await db.schedule.create({
      data: {
        packageId,
        day: new Date(date),
        schedulePackage: scheduleTimeForPackage,
        scheduleStatus,
      },
    });
    return createSchedule;
  } catch (error) {
    return null;
  }
}
