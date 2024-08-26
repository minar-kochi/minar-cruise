import { NUMBER_MATCH } from "@/lib/helpers/regex";
import {
  isPackageStatusCustom,
  isPackageStatusExclusive,
} from "@/lib/validators/Package";
import { isStatusCustom } from "@/lib/validators/Schedules";
import { $Enums } from "@prisma/client";

export function getPackageTitleWithTimeIfNotExists(
  packageTitle: string,
  duration: number | null,
  packageType: $Enums.PACKAGE_CATEGORY,
) {
  if (
    isPackageStatusExclusive(packageType) ||
    isPackageStatusCustom(packageType)
  ) {
    return packageTitle;
  }

  const durations = duration ? duration : 0;

  const title = packageTitle ? packageTitle : "";

  const prefix = NUMBER_MATCH.test(title)
    ? title
    : `${title} ${durations / 60} hr`;
  return prefix;
}
