import type { IstDayKey } from "@/lib/datetime";
import { PackageSelect } from "@/db/data/dto/package";
import { TScheduleDataDayReplaceString } from "../type";
import { Dispatch, SetStateAction } from "react";
import { $Enums } from "@prisma/client";
import { getupComingScheduleDates } from "@/db/data/dto/schedule/schedule";

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
    startsAt?: Date | null;
    endsAt?: Date | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.BREAKFAST;
  };
  lunch: {
    fromTime?: string | null;
    toTime?: string | null;
    packageId?: string | null;
    startsAt?: Date | null;
    endsAt?: Date | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.LUNCH;
  };
  sunset: {
    fromTime?: string | null;
    toTime?: string | null;
    packageId?: string | null;
    startsAt?: Date | null;
    endsAt?: Date | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.SUNSET;
  };
  dinner: {
    fromTime?: string | null;
    toTime?: string | null;
    packageId?: string | null;
    startsAt?: Date | null;
    endsAt?: Date | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.DINNER;
  };
  custom: {
    fromTime?: string | null;
    toTime?: string | null;
    packageId?: string | null;
    startsAt?: Date | null;
    endsAt?: Date | null;
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
  /**
   * A real Date. This was `Date | string` because tRPC serialised Dates to
   * strings without superjson, so the same field arrived as either type
   * depending on whether it came from the server or the wire — and every
   * consumer had to handle both. superjson revives it as a Date on both sides
   * now, so the union is gone.
   */
  day: Date;
  schedulePackage: $Enums.SCHEDULED_TIME;
  scheduleStatus: $Enums.SCHEDULE_STATUS;
};

export type ScheduleGrouped = {
  [key: string]: TSchedulesData[];
};

/** Admin store shape — keyed by IST day, like everything else in that store. */
export type TSchedulePackageData = {
  id: string;
  Package: {
    title: string;
    startMinutesIst: number | null;
  } | null;
  day: IstDayKey;
  startsAt: Date | null;
  endsAt: Date | null;
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

export type GroupedScheduleWithBookingCount = {
  [key: string]: TScheduleWithBookingCount[];
};

export type InfinitySchedulesWithBookingCount = {
  response: TScheduleWithBookingCount[];
  nextCursor?: string | undefined;
};

export type TScheduleWithBookingCount = {
  id: string;
  day: IstDayKey;
  startsAt: Date | null;
  endsAt: Date | null;
  schedulePackage: $Enums.SCHEDULED_TIME;
  scheduleStatus: $Enums.SCHEDULE_STATUS;
  Booking: number;
  Package: {
    title: string;
    startMinutesIst: number | null;
  } | null;
};
