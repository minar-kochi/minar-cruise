import {
  TOrganizedScheduleData,
  TSelectedPackageIdsAndScheduleEnum,
} from "@/Types/Schedule/ScheduleSelect";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import {
  isStatusBreakfast,
  isStatusDinner,
  isStatusLunch,
  isStatusSunset,
} from "../validators/Schedules";
import { randomUUID } from "crypto";
import { Schedule } from "@prisma/client";
import { TExcludedOrganizedPackageData } from "@/Types/packages/package";
import { RemoveTimeStampFromDate } from "../utils";

export function organizeScheduleData({
  data,
}: {
  data: TScheduleDataDayReplaceString[];
}): TOrganizedScheduleData {
  let organizedData: TOrganizedScheduleData = {
    breakfast: null,
    lunch: null,
    sunset: null,
    dinner: null,
    custom: null,
  };

  for (const Schedules of data) {
    if (!Schedules.id) continue;

    if (isStatusBreakfast(Schedules.schedulePackage)) {
      organizedData.breakfast = Schedules;
      continue;
    }
    if (isStatusSunset(Schedules.schedulePackage)) {
      organizedData.sunset = Schedules;
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
  OrgData: TOrganizedScheduleData,
): TSelectedPackageIdsAndScheduleEnum {
  return {
    breakfast: {
      id: OrgData.breakfast?.packageId,
      fromTime: OrgData.breakfast?.fromTime,
      toTime: OrgData.breakfast?.toTime,
      scheduleTime: "BREAKFAST",
    },
    custom: {
      id: OrgData.custom?.packageId,
      fromTime: OrgData.custom?.fromTime,
      toTime: OrgData.custom?.toTime,
      scheduleTime: "CUSTOM",
    },
    sunset: {
      id: OrgData.dinner?.packageId,
      fromTime: OrgData.dinner?.fromTime,
      toTime: OrgData.custom?.toTime,
      scheduleTime: "SUNSET",
    },
    dinner: {
      id: OrgData.dinner?.packageId,
      fromTime: OrgData.dinner?.fromTime,
      toTime: OrgData.custom?.toTime,
      scheduleTime: "DINNER",
    },
    lunch: {
      id: OrgData.lunch?.packageId,
      fromTime: OrgData.breakfast?.fromTime,
      toTime: OrgData.breakfast?.scheduleStatus,
      scheduleTime: "LUNCH",
    },
  };
}

export function convertScheduleDataDateToDateString(
  Schedule: Schedule,
): TScheduleDataDayReplaceString {
  return {
    ...Schedule,
    day: RemoveTimeStampFromDate(Schedule.day),
  };
}
