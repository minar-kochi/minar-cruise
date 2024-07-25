import { TOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import {
  isStatusBreakfast,
  isStatusDinner,
  isStatusLunch,
} from "../validators/ScheudulePackage";

export function organizeScheduleData({
  data,
}: {
  data: TScheduleDataDayReplaceString[] | null;
}): TOrganizedScheduleData | null {
  let organizedData: TOrganizedScheduleData | null = {
    breakfast: null,
    dinner: null,
    lunch: null,
    custom: null,
  };
  if (!data) {
    return null;
  }

  for (const Schedules of data) {
    if (!Schedules.id) continue;

    if (isStatusBreakfast(Schedules.schedulePackage)) {
      organizedData.breakfast = Schedules;
      continue;
    }
    if (isStatusDinner(Schedules.schedulePackage)) {
      organizedData.dinner = Schedules;
      continue;
    }
    if (isStatusLunch(Schedules.schedulePackage)) {
      organizedData.lunch = Schedules;
      continue;
    }
    organizedData.custom = Schedules;
  }

  return organizedData;
}
