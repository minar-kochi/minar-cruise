import { TScheduleDayReplaceString } from "@/Types/type";

export type TOrganizedData = {
  breakfast: TScheduleDayReplaceString | null;
  lunch: TScheduleDayReplaceString | null;
  dinner: TScheduleDayReplaceString | null;
};
export function organizedData({
  data,
}: {
  data: TScheduleDayReplaceString[] | null;
}): TOrganizedData | null {
  let organizedData: TOrganizedData | null = {
    breakfast: null,
    dinner: null,
    lunch: null,
  };
  if (!data) {
    return null;
  }

  for (const Schedules of data) {
    if (Schedules.schedulePackage === "BREAKFAST") {
      organizedData.breakfast = Schedules;
      continue;
    }
    if (Schedules.schedulePackage === "DINNER") {
      organizedData.dinner = Schedules;
      continue;
    }
    organizedData.lunch = Schedules;
  }

  return organizedData;
}
