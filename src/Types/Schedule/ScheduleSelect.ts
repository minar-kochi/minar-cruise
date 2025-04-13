import { PackageSelect } from "@/db/data/dto/package";
import { TScheduleDataDayReplaceString } from "../type";
import { Dispatch, SetStateAction } from "react";
import { $Enums } from "@prisma/client";
import { getupComingScheduleDates } from "@/db/data/dto/schedule";

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
export type TRawOrganizedupComingSchedule = typeof getupComingScheduleDates;

export type TOrganizedupComingSchedule = Awaited<
  ReturnType<TRawOrganizedupComingSchedule>
>;

export type TExcludedOrganizedUpComingSchedule = Exclude<
  TOrganizedupComingSchedule,
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

export type TSchedulesData = {
  id: string;
  packageId: string | null;
  day: Date | string;
  schedulePackage: $Enums.SCHEDULED_TIME;
  scheduleStatus: $Enums.SCHEDULE_STATUS;
};

export type ScheduleGrouped = {
  [key: string]: TSchedulesData[];
};

export type TSchedulePackageData = {
  id: string;
  Package: {
    fromTime: string;
    toTime: string;
    title: string;
  } | null;
  day: string;
  fromTime: string | null;
  toTime: string | null;
  packageId: string | null;
  schedulePackage: $Enums.SCHEDULED_TIME;
  scheduleStatus: $Enums.SCHEDULE_STATUS;
};

export type GroupedSchedulePackageData = {
  [key: string]: TSchedulePackageData[];
};

export type InfinitySchedulePackageData = {
  schedules: TSchedulePackageData[];
  nextCursor?: string | undefined;
};
