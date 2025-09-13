import {
  isBreakFast,
  isDinner,
  isLunch,
  isPackageStatusBreakfast,
  isSunset,
  ShouldPackageBeAvailableForPublicToSchedule,
} from "@/lib/validators/Package";
import { PACKAGE_CATEGORY, SCHEDULED_TIME } from "@prisma/client";

export function findCorrespondingScheduleTimeFromPackageCategory(
  packageCategory: PACKAGE_CATEGORY,
): SCHEDULED_TIME | null {
  if (!ShouldPackageBeAvailableForPublicToSchedule(packageCategory)) {
    return null;
  }

  if (isBreakFast(packageCategory)) {
    return "BREAKFAST";
  }
  if (isLunch(packageCategory)) {
    return "LUNCH";
  }
  if (isDinner(packageCategory)) {
    return "DINNER";
  }
  if (isSunset(packageCategory)) {
    return "SUNSET";
  }
  return null;
}
