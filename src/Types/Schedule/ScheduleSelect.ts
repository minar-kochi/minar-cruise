import { TselectDate } from "@/components/admin/dashboard/ScheduleSelector";
import { PackageSelect } from "@/db/data/dto/package";
import { TScheduleDataDayReplaceString } from "../type";
import { Dispatch, SetStateAction } from "react";

export type TScheduleSelect = {
  packages: PackageSelect[];
  type: keyof TselectDate;
  selected: TScheduleDataDayReplaceString | null | undefined;
  setSelectedDate: Dispatch<SetStateAction<TselectDate | null>>;
};

export type TOrganizedScheduleData = {
  breakfast: TScheduleDataDayReplaceString | null;
  lunch: TScheduleDataDayReplaceString | null;
  dinner: TScheduleDataDayReplaceString | null;
  custom: TScheduleDataDayReplaceString | null;
};
