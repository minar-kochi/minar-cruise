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
import { DefaultMergedScheduleTimer } from "@/lib/features/schedule/selector";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import { TScheduleSelector } from "@/Types/type";

export default function MinuteSelector({
  eventType,
  onChange,
  type,
}: TTimeSelector & TScheduleSelector) {
  const defaultSelectTimer = useAppSelector((state) =>
    DefaultMergedScheduleTimer(state, type),
  );

  return (
    <Select
      onValueChange={(value) => onChange(eventType, { min: value }, "min")}
      defaultValue={
        defaultSelectTimer?.value
          ? defaultSelectTimer?.value[eventType].min
          : undefined
      }
    >
      <SelectTrigger className="max-w-[100px]">
        <SelectValue placeholder={"Minute"} />
      </SelectTrigger>
      <SelectContent className="max-w-[100px] min-w-10">
        {/* @TODO Extract this logic to be more understandable. */}
        {new Array(4).fill(null).map((_, i) => {
          return (
            <SelectItem
              key={`timer-${i}`}
              value={`${(i * 15).toString().padStart(2, "0")}`}
              className="max-w-[100px]"
            >
              {(i * 15).toString().padStart(2, "0")}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
