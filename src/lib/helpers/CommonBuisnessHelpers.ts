import { isValidMergeTimeCycle } from "../utils";

export const selectFromTimeAndToTimeFromScheduleOrPackages = ({
  Packages,
  schedule,
}: {
  schedule: {
    scheduleToTime: string | null;
    scheduleFromTime: string | null;
  };
  Packages: {
    packageToTime: string | null;
    packageFromTime: string | null;
  };
}): {
  fromTime: string;
  toTime: string;
} => {
  const { scheduleFromTime, scheduleToTime } = schedule;
  const { packageFromTime, packageToTime } = Packages;
  const isScheduleToValid = isValidMergeTimeCycle(scheduleFromTime ?? "");
  const isScheduleFromValid = isValidMergeTimeCycle(scheduleToTime ?? "");
  if (
    isScheduleToValid &&
    isScheduleFromValid &&
    scheduleFromTime &&
    scheduleToTime
  ) {
    return {
      fromTime: scheduleFromTime,
      toTime: scheduleToTime,
    };
  }
  const isPackageToValid = isValidMergeTimeCycle(packageFromTime ?? "");
  const isPackageFromValid = isValidMergeTimeCycle(packageToTime ?? "");
  if (
    isPackageToValid &&
    isPackageFromValid &&
    packageFromTime &&
    packageToTime
  ) {
    return {
      fromTime: packageFromTime,
      toTime: packageToTime,
    };
  }
  return {
    fromTime: "",
    toTime: "",
  };
};
