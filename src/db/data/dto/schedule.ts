import { db } from "@/db";
import { isProd } from "@/lib/utils";

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


export type TGetSchedule = Exclude<Awaited<ReturnType<typeof getSchedule>>, null>

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
