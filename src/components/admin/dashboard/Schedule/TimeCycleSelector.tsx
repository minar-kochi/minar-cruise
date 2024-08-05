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
import { TScheduleSelector } from "@/Types/type";
import { DefaultMergedScheduleTimer } from "@/lib/features/schedule/selector";
import { useAppSelector } from "@/hooks/adminStore/reducer";

export default function TimeCycleSelector({
  eventType,
  onChange,
  type,
}: TTimeSelector & TScheduleSelector) {
  const defaultSelectTimer = useAppSelector((state) =>
    DefaultMergedScheduleTimer(state, type),
  );

  return (
    <Select
      defaultValue={
        defaultSelectTimer?.value
          ? defaultSelectTimer?.value[eventType].Cycle
          : "AM"
      }
      onValueChange={(value) => {
        if (value !== "AM" && value !== "PM") return;
        void onChange(eventType, { Cycle: value }, "Cycle");
      }}
    >
      <SelectTrigger className="max-w-[100px]">
        <SelectValue placeholder={"AM"} />
      </SelectTrigger>
      <SelectContent className="max-w-[100px] min-w-10">
        <SelectItem value="PM" className="max-w-[100px]">
          PM
        </SelectItem>
        <SelectItem value="AM" className="max-w-[100px]">
          AM
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
