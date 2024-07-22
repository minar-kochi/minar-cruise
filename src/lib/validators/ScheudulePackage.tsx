import { $Enums } from "@prisma/client";

// import
export function isStatusBreakfast(SchedulePackage: string) {
  return SchedulePackage === $Enums.SCHEDULE_PACKAGE.BREAKFAST;
}

export function isStatusDinner(SchedulePackage: string) {
  return SchedulePackage === $Enums.SCHEDULE_PACKAGE.DINNER;
}

export function isStatusLunch(SchedulePackage: string) {
  return SchedulePackage === $Enums.SCHEDULE_PACKAGE.LUNCH;
}

export function isStatusCustom(SchedulePackage: string) {
  return SchedulePackage === $Enums.SCHEDULE_PACKAGE.CUSTOM;
}
