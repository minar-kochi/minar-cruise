import {
  TOrganizedScheduleData,
  TSelectedPackageIdsAndScheduleEnum,
} from "@/Types/Schedule/ScheduleSelect";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import {
  isStatusBreakfast,
  isStatusDinner,
  isStatusLunch,
} from "../validators/ScheudulePackage";
import { randomUUID } from "crypto";

export function organizeScheduleData({
  data,
}: {
  data: TScheduleDataDayReplaceString[];
}): TOrganizedScheduleData {
  let organizedData: TOrganizedScheduleData = {
    breakfast: null,
    dinner: null,
    lunch: null,
    custom: null,
  };

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

export function placeOrganizedDataIntoPackageIdAndScheduleTime(
  OrgData: TOrganizedScheduleData
): TSelectedPackageIdsAndScheduleEnum {
  return {
    breakfast: {
      id: OrgData.breakfast?.packageId,
      time: OrgData.breakfast?.time,
      scheduleTime: "BREAKFAST",
    },
    custom: {
      id: OrgData.custom?.packageId,
      time: OrgData.breakfast?.time,
      scheduleTime: "CUSTOM",
    },
    dinner: {
      id: OrgData.dinner?.packageId,
      time: OrgData.breakfast?.time,
      scheduleTime: "DINNER",
    },
    lunch: {
      id: OrgData.lunch?.packageId,
      time: OrgData.breakfast?.time,
      scheduleTime: "LUNCH",
    },
  };
}
