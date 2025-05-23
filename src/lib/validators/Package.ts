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
export function ShouldPackageBeAvailableForPublicToSchedule(
  packageCategory: $Enums.PACKAGE_CATEGORY,
) {
  if (packageCategory === "CUSTOM" || packageCategory === "EXCLUSIVE") {
    return false;
  }
  return true;
}
export type IsPackageTypeOrExclusiveChecker = {
  packageStatus: string;
  exclusive?: boolean;
};
export function isPackageStatusExclusive(packageStatus: string) {
  return packageStatus === $Enums.PACKAGE_CATEGORY.EXCLUSIVE;
}
export function isPackageStatusCustom(packageStatus: string) {
  return packageStatus === $Enums.PACKAGE_CATEGORY.CUSTOM;
}
export function isPackageStatusBreakfast({
  packageStatus,
  exclusive,
}: IsPackageTypeOrExclusiveChecker) {
  return (
    packageStatus === $Enums.PACKAGE_CATEGORY.BREAKFAST ||
    (exclusive && isPackageStatusExclusive(packageStatus))
  );
}

export function isPackageStatusLunch({
  packageStatus,
  exclusive,
}: IsPackageTypeOrExclusiveChecker) {
  return (
    packageStatus === $Enums.PACKAGE_CATEGORY.LUNCH ||
    (exclusive && isPackageStatusExclusive(packageStatus))
  );
}
export function isPackageStatusDinner({
  packageStatus,
  exclusive,
}: IsPackageTypeOrExclusiveChecker) {
  return (
    packageStatus === $Enums.PACKAGE_CATEGORY.DINNER ||
    (exclusive && isPackageStatusExclusive(packageStatus))
  );
}
export function isPackageStatusSunSet({
  packageStatus,
  exclusive,
}: IsPackageTypeOrExclusiveChecker) {
  return (
    packageStatus === $Enums.PACKAGE_CATEGORY.SUNSET ||
    (exclusive && isPackageStatusExclusive(packageStatus))
  );
}

export function isBreakFast(packageCategory: string) {
  if (packageCategory === $Enums.PACKAGE_CATEGORY.BREAKFAST) return true;
  return false;
}
export function isSunset(packageCategory: string) {
  if (packageCategory === $Enums.PACKAGE_CATEGORY.SUNSET) return true;
  return false;
}
export function isLunch(packageCategory: string) {
  if (packageCategory === $Enums.PACKAGE_CATEGORY.LUNCH) return true;
  return false;
}
export function isDinner(packageCategory: string) {
  return packageCategory === $Enums.PACKAGE_CATEGORY.DINNER;
}
export function isExclusive(packageCategory: string) {
  return packageCategory === $Enums.PACKAGE_CATEGORY.EXCLUSIVE;
}
