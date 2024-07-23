import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PackageSelect } from "@/db/data/dto/package";
import React, { Dispatch, SetStateAction } from "react";
import { TselectDate } from "../ScheduleSelector";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import { useScheduleStore } from "@/providers/admin/schedule-store-provider";

export type FC_TScheduleSelect = {
  packages: PackageSelect[];
  type: keyof TselectDate;
};

export default function ScheduleSelect({ packages, type }: FC_TScheduleSelect) {
  const { organizedSchedule, updateSelectedSchedulePackageId } = useScheduleStore(
    (state) => state
  );
  
  return (
    <Select
      onValueChange={(value) => {
        updateSelectedSchedulePackageId(type, value);
      }}
      defaultValue={
        (organizedSchedule && organizedSchedule[type]?.packageId) ?? undefined
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={"Select a Package"} />
      </SelectTrigger>
      <SelectContent>
        {packages.map((item) => {
          return (
            <SelectItem key={item.id} value={item.id}>
              {item.title}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
