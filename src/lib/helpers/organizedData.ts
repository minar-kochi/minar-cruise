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
import { IstDayKey, dayKeyOfDateColumn } from "@/lib/datetime";

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
      scheduleTime: "BREAKFAST",
    },
    custom: {
      id: OrgData.custom?.packageId,
      scheduleTime: "CUSTOM",
    },
    sunset: {
      id: OrgData.dinner?.packageId,
      scheduleTime: "SUNSET",
    },
    dinner: {
      id: OrgData.dinner?.packageId,
      scheduleTime: "DINNER",
    },
    lunch: {
      id: OrgData.lunch?.packageId,
      scheduleTime: "LUNCH",
    },
  };
}

/**
 * Re-keys a schedule row by its IST calendar day.
 *
 * Generic over the row shape on purpose: the callers are Prisma `select`s of
 * varying width (the schedule table takes fewer columns than the booking view),
 * and this function only cares about `day`. Typing it to the full `Schedule`
 * model forced partial selects to be cast, which defeated the point.
 */
export function convertScheduleDataDateToDateString<T extends { day: Date }>(
  Schedule: T,
): Omit<T, "day"> & { day: IstDayKey } {
  const day = dayKeyOfDateColumn(Schedule.day);
  if (!day) {
    throw new Error(
      `Schedule has an unreadable day column — refusing to build a keyed schedule with a wrong date.`,
    );
  }
  // Only `day` changes representation, to its IST calendar key. createdAt,
  // updatedAt, startsAt and endsAt stay real Dates.
  //
  // This previously overwrote createdAt AND updatedAt with the *day* — so every
  // admin screen reading a schedule's createdAt was reading its sailing date
  // instead. Nothing depended on the wrong values, so restoring them is safe.
  return { ...Schedule, day };
}
