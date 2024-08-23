import { $Enums } from "@prisma/client";

export function isStatusBreakfast(SchedulePackage: string) {
  return SchedulePackage === $Enums.SCHEDULED_TIME.BREAKFAST;
}

export function isStatusDinner(SchedulePackage: string) {
  return SchedulePackage === $Enums.SCHEDULED_TIME.DINNER;
}

export function isStatusLunch(SchedulePackage: string) {
  return SchedulePackage === $Enums.SCHEDULED_TIME.LUNCH;
}

export function isStatusCustom(SchedulePackage: string) {
  return SchedulePackage === $Enums.SCHEDULED_TIME.CUSTOM;
}

