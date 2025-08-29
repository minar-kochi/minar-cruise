import { db } from "@/db";

export async function DeleteBlockedDays(dates: Date[]) {
  return await db.$transaction((tx) =>
    tx.schedule.deleteMany({
      where: {
        day: {
          in: dates,
        },
      },
    }),
  );
}
export async function getAvailableScheduleCountForGivenDateArray(
  dates: Date[],
) {
  return await db.schedule.count({
    where: {
      day: {
        in: dates,
      },
      scheduleStatus: "AVAILABLE",
    },
  });
}
export async function getBlockedScheduleCountForGivenDateArray(dates: Date[]) {
  return await db.schedule.count({
    where: {
      day: {
        in: dates,
      },
      scheduleStatus: "BLOCKED",
    },
  });
}