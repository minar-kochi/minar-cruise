import { TselectDate } from "@/components/admin/dashboard/ScheduleSelector";
import { PackageSelect } from "@/db/data/dto/package";
import { TScheduleDayReplaceString } from "../type";
import { Dispatch, SetStateAction } from "react";

export type TScheduleSelect = {
  packages: PackageSelect[];
  type: keyof TselectDate;
  selected: TScheduleDayReplaceString | null | undefined;
  setSelectedDate: Dispatch<SetStateAction<TselectDate | null>>;
};

export type TOrganizedScheduleData = {
  breakfast: TScheduleDayReplaceString | null;
  lunch: TScheduleDayReplaceString | null;
  dinner: TScheduleDayReplaceString | null;
  custom: TScheduleDayReplaceString | null;
};
