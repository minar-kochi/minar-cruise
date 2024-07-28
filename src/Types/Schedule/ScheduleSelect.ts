import { PackageSelect } from "@/db/data/dto/package";
import { TScheduleDataDayReplaceString } from "../type";
import { Dispatch, SetStateAction } from "react";
import { $Enums } from "@prisma/client";

export type TSelectedPackageIdsAndScheduleEnum = {
  breakfast?: {
    id?: string | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.BREAKFAST;
  };
  lunch?: {
    id?: string | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.LUNCH;
  };
  dinner?: {
    id?: string | null;
    scheduleTime: typeof $Enums.SCHEDULED_TIME.DINNER;
  };
  custom?: {
    id?: string | null;
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
  dinner: TScheduleDataDayReplaceString | null;
  custom: TScheduleDataDayReplaceString | null;
};
