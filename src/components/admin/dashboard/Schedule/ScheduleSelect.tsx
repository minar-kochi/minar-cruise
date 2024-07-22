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
import { TScheduleDayReplaceString } from "@/Types/type";

export type FC_TScheduleSelect = {
  //   index?: number | null,
  packages: PackageSelect[];
  type: keyof TselectDate;
  selected: TScheduleDayReplaceString | null | undefined;
  setSelectedPackageId: Dispatch<SetStateAction<TselectDate | null>>;
};

export default function ScheduleSelect({
  packages,
  setSelectedPackageId,
  type,
  selected,
}: FC_TScheduleSelect) {
  return (
    <Select
      defaultValue={selected?.packageId ?? undefined}
      
      onValueChange={(value) => {
        setSelectedPackageId((prev) => {
          return {
            ...prev,
            [type]: value,
          };
        });
      }}
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
