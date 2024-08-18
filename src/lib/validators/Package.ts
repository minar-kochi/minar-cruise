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
