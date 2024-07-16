import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TScheduleDayReplaceString } from "@/Types/type";
import { PackageSelect, TgetPackageScheduleDatas } from "@/db/data/dto/package";

export type TS = keyof Exclude<TgetPackageScheduleDatas, null>;
export type TScheduleSelect = {
  packages: PackageSelect[];
  selected: TScheduleDayReplaceString | null | undefined;
};
export default function ScheduleSelect({
  selected,
  packages,
}: TScheduleSelect) {
  return (
    <Select
      defaultValue={selected?.packageId ?? undefined}
      onValueChange={(value) => {
        console.log(value);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue
          defaultValue={selected?.id ?? ""}
          placeholder={"Select a Package"}
        />
      </SelectTrigger>
      <SelectContent onChange={(e) => {}}>
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
