import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TTimeSelector } from "./ExclusiveScheduleTime";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import {
  DefaultMergedSchedule,
  DefaultMergedScheduleTimer,
} from "@/lib/features/schedule/selector";
import { TScheduleSelector } from "@/Types/type";
import { mergeTimeCycle } from "@/lib/utils";

export default function HourSelector({
  onChange,
  type,
  eventType,
}: TTimeSelector & TScheduleSelector) {
  // const { OrganizedPackage } = useAppSelector((state) => state.packages);
  // const { currentDateSchedule } = useAppSelector((state) => state.schedule);
  // const defaultSelect = useAppSelector((state) =>
  //   DefaultMergedSchedule(state, type),
  // );

  const defaultSelectTimer = useAppSelector((state) =>
    DefaultMergedScheduleTimer(state, type),
  );

  return (
    <Select
      onValueChange={(value) => onChange(eventType, { hours: value }, "hours")}
      defaultValue={
        defaultSelectTimer?.value
          ? defaultSelectTimer?.value[eventType].hours
          : undefined
      }
    >
      <SelectTrigger className="max-w-[100px] min-w-20">
        <SelectValue placeholder={"Hours"} />
      </SelectTrigger>
      <SelectContent className="max-w-[100px] min-w-20">
        {new Array(12).fill(null).map((_, i) => {
          return (
            <SelectItem
              key={`timer-${i}`}
              value={`${(i + 1).toString().padStart(2, "0")}`}
              className="max-w-[100px] min-w-20"
            >
              {(i + 1).toString().padStart(2, "0")}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
