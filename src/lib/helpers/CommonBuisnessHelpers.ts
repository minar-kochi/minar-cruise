import { isValidMergeTimeCycle } from "../utils";
import { error } from "console";
import { Resend } from "resend";

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

export const phoneNumberParser = (contact: string | undefined) => {
  if (!contact) {
    return null;
  }

  const countryCodePrefix = "+91";

  if (!contact.startsWith("0", 0)) {
    const countryCodePrefix = "+91";
    const parsedPhoneNumber = countryCodePrefix + contact;
    return parsedPhoneNumber;
  }

  const removedZeroFromPhoneNumber = contact.slice(1);
  const parsedPhoneNumber = countryCodePrefix + removedZeroFromPhoneNumber;
  return parsedPhoneNumber;
};



