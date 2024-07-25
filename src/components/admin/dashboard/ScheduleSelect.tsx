import React, { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import { PackageSelect, TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TselectDate } from "./ScheduleSelector";
import toast from "react-hot-toast";

// export type TS = keyof Exclude<TgetPackageScheduleDatas, null>;
export type TScheduleSelect = {
  packages: PackageSelect[];
  type: keyof TselectDate;
  selected: TScheduleDataDayReplaceString | null | undefined;
  setSelectedDate: Dispatch<SetStateAction<TselectDate | null>>;
};
export default function ScheduleSelect({
  selected,
  packages,
  setSelectedDate,
  type,
}: TScheduleSelect) {
  return (
    <Select
      defaultValue={selected?.packageId ?? undefined}
      onValueChange={(value) => {
        setSelectedDate((prev) => {
          return {
            ...prev,
            [type]: value,
          };
        });
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          defaultValue={selected?.id ?? ""}
          placeholder={"Select a Package"}
        />
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

export type TSchedulesSelect = {
  packages: PackageSelect[];
  type: keyof TselectDate;
  selected: TScheduleDataDayReplaceString | null | undefined;
  setSelectedDate: Dispatch<SetStateAction<TselectDate | null>>;
};

export function SchedulesSelect({
  selected,
  packages,
  setSelectedDate,
  type,
}: TScheduleSelect) {
  return (
    <Select
      defaultValue={selected?.packageId ?? undefined}
      onValueChange={(value) => {
        setSelectedDate((prev) => {
          return {
            ...prev,
            [type]: value,
          };
        });
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          defaultValue={selected?.id ?? ""}
          placeholder={"Select a Package"}
        />
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
