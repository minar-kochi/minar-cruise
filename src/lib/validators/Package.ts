import { $Enums } from "@prisma/client";
import { isStatusCustom } from "./Schedules";
type TShouldStatusBeAvaiablePublicWithPackage = {
  packageCategory: $Enums.PACKAGE_CATEGORY;
  scheduleTime: $Enums.SCHEDULED_TIME;
};
export function ShouldStatusBeAvaiablePublicWithPackage({
  packageCategory,
  scheduleTime,
}: TShouldStatusBeAvaiablePublicWithPackage): $Enums.SCHEDULE_STATUS {
  if (isStatusCustom(scheduleTime)) {
    return "EXCLUSIVE";
  }
  if (isPackageStatusExclusive(packageCategory)) {
    return "EXCLUSIVE";
  }
  return "AVAILABLE";
}

export function isPackageStatusExclusive(value: $Enums.PACKAGE_CATEGORY) {
  if (value !== "EXCLUSIVE") {
    return false;
  }
  return true;
}

export function isBreakFast(packageCategory: string) {
  if(packageCategory === $Enums.PACKAGE_CATEGORY.BREAKFAST) return true
  return false 
}
export function isLunch(packageCategory: string) {
  if(packageCategory === $Enums.PACKAGE_CATEGORY.LUNCH) return true
  return false 
}
export function isDinner(packageCategory: string) {
  return packageCategory === $Enums.PACKAGE_CATEGORY.DINNER;
}
export function isExclusive(packageCategory: string) {
  return packageCategory === $Enums.PACKAGE_CATEGORY.EXCLUSIVE;
}
