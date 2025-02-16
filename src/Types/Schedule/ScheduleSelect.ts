import { PackageSelect } from "@/db/data/dto/package";
import { TScheduleDataDayReplaceString } from "../type";
import { Dispatch, SetStateAction } from "react";
import { $Enums } from "@prisma/client";
import { getUpcommingScheduleDates } from "@/db/data/dto/schedule";

export type TSelectedPackageIdsAndScheduleEnum = {
  breakfast?: {
    id?: string | null;
    fromTime?: string | null;
    toTime?: string | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.BREAKFAST;
  };
  lunch?: {
    id?: string | null;
    fromTime?: string | null;
    toTime?: string | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.LUNCH;
  };
  sunset?: {
    id?: string | null;
    fromTime?: string | null;
    toTime?: string | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.SUNSET;
  };
  dinner?: {
    id?: string | null;
    fromTime?: string | null;
    toTime?: string | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.DINNER;
  };
  custom?: {
    id?: string | null;
    fromTime?: string | null;
    toTime?: string | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.CUSTOM;
  };
};

export type TselectedPackageIdsAndScheduleMapToEnum = Record<
  keyof TSelectedPackageIdsAndScheduleEnum,
  $Enums.SCHEDULED_TIME
>;

export const selectedPackageIdsAndScheduleMapToEnum: TselectedPackageIdsAndScheduleMapToEnum =
  {
    breakfast: "BREAKFAST",
    custom: "CUSTOM",
    sunset: "SUNSET",
    dinner: "DINNER",
    lunch: "LUNCH",
  } as const;

export type TScheduleSelect = {
  packages: PackageSelect[];
  type: keyof TSelectedPackageIdsAndScheduleEnum;
  selected: TScheduleDataDayReplaceString | null | undefined;
  setSelectedDate: Dispatch<
    SetStateAction<TSelectedPackageIdsAndScheduleEnum | null>
  >;
};

export type TOrganizedScheduleData = {
  breakfast: TScheduleDataDayReplaceString | null;
  lunch: TScheduleDataDayReplaceString | null;
  sunset: TScheduleDataDayReplaceString | null;
  dinner: TScheduleDataDayReplaceString | null;
  custom: TScheduleDataDayReplaceString | null;
};
export type TKeyOrganizedScheduleData = keyof TOrganizedScheduleData;

export type TIsScheduleChange = {
  [K in TKeyOrganizedScheduleData]: boolean;
};
export type TUpdatedDateSchedulePackageId = {
  breakfast: {
    packageId?: string | null;
    fromTime?: string | null;
    toTime?: string | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.BREAKFAST;
  };
  lunch: {
    fromTime?: string | null;
    toTime?: string | null;
    packageId?: string | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.LUNCH;
  };
  sunset: {
    fromTime?: string | null;
    toTime?: string | null;
    packageId?: string | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.SUNSET;
  };
  dinner: {
    fromTime?: string | null;
    toTime?: string | null;
    packageId?: string | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.DINNER;
  };
  custom: {
    fromTime?: string | null;
    toTime?: string | null;
    packageId?: string | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.CUSTOM;
  };
};
export type TRawOrganizedUpcommingSchedule = typeof getUpcommingScheduleDates;

export type TOrganizedUpcommingSchedule = Awaited<
  ReturnType<TRawOrganizedUpcommingSchedule>
>;

export type TExcludedOrganizedUpcommingSchedule = Exclude<
  TOrganizedUpcommingSchedule,
  null
>;

export type TScheduleWithBookingCountWithId = {
  id: string;
  day: string;
  schedulePackage: string;
  scheduleStatus: string;
  Booking: {
    id: string;
  }[];
  totalBookings: number;
}[];

export type ScheduleGrouped = {
  [key: string]: {
    packageId: string | null;
    id: string;
    day: Date | string;
    schedulePackage: $Enums.SCHEDULED_TIME;
    scheduleStatus: $Enums.SCHEDULE_STATUS;
  }[];
};
