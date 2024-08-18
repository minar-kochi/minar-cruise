import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import { IsIdExclusive } from "@/lib/features/Package/selector";
import {
  currentScheduleTimer,
  DefaultMergedSchedule,
} from "@/lib/features/schedule/selector";
import { TkeyDbTime, TScheduleSelector, TTimeCycle } from "@/Types/type";
import React, { useEffect, useState } from "react";
import HourSelector from "./HourSelector";
import MinuteSelector from "./minuteSelector";
import TimeCycleSelector from "./TimeCycleSelector";
import { isTimeCycleValid, mergeTimeCycle, splitTimeColon } from "@/lib/utils";
import { setUpdatableScheduleTime } from "@/lib/features/schedule/ScheduleSlice";

export type TTimeSelector = {
  onChange: (
    event: TkeyDbTime,
    param: Partial<TTimeCycle>,
    target: keyof TTimeCycle,
  ) => void;
  eventType: TkeyDbTime;
};
export default function ExclusiveScheduleTime({ type }: TScheduleSelector) {
  const dispatch = useAppDispatch();
  const defaultSelect = useAppSelector((state) =>
    DefaultMergedSchedule(state, type),
  );
  const defaultSelectTimer = useAppSelector((state) =>
    currentScheduleTimer(state, type),
  );

  const [fromTime, setFromTime] = useState<TTimeCycle>({
    hours: defaultSelectTimer?.value.fromTime.hours ?? "",
    min: defaultSelectTimer?.value.fromTime.min ?? "",
    Cycle: defaultSelectTimer?.value.fromTime.Cycle ?? "AM",
  });
  const [toTime, setToTime] = useState<TTimeCycle>({
    hours: defaultSelectTimer?.value.toTime.hours ?? "",
    min: defaultSelectTimer?.value.toTime.min ?? "",
    Cycle: defaultSelectTimer?.value.toTime.Cycle ?? "AM",
  });

  useEffect(() => {
    if (isTimeCycleValid(fromTime)) {
      let parsedTime = mergeTimeCycle(fromTime);
      if (parsedTime) {
        dispatch(
          setUpdatableScheduleTime({
            eventType: "fromTime",
            time: parsedTime,
            type,
          }),
        );
      }
    }
  }, [fromTime, type, dispatch]);

  useEffect(() => {
    if (isTimeCycleValid(toTime)) {
      let parsedTime = mergeTimeCycle(toTime);
      if (parsedTime) {
        dispatch(
          setUpdatableScheduleTime({
            eventType: "toTime",
            time: parsedTime,
            type,
          }),
        );
      }
    }
  }, [toTime, type, dispatch]);

  function handleTimeChange(
    event: TkeyDbTime,
    param: Partial<TTimeCycle>,
    target: keyof TTimeCycle,
  ) {
    if (event === "fromTime") {
      setFromTime((prev) => {
        return {
          ...prev,
          [target]: param[target],
        };
      });
    }
    if (event === "toTime") {
      setToTime((prev) => {
        return {
          ...prev,
          [target]: param[target],
        };
      });
    }
  }

  const isExclusive = useAppSelector((state) =>
    IsIdExclusive(state, defaultSelect.packageId),
  );

  if (!isExclusive) return null;

  return (
    <div className="">
      <div className="indent-1">
        <Label htmlFor="from-date-id">From:</Label>
        <div className="flex w-full  gap-x-4">
          <HourSelector
            type={type}
            eventType="fromTime"
            onChange={handleTimeChange}
          />
          <MinuteSelector
            type={type}
            eventType="fromTime"
            onChange={handleTimeChange}
          />
          <TimeCycleSelector
            type={type}
            eventType="fromTime"
            onChange={handleTimeChange}
          />
        </div>
      </div>
      <div className="indent-1">
        <Label htmlFor="from-date-id">To:</Label>
        <div className="flex w-full  gap-x-4">
          <HourSelector
            type={type}
            eventType="toTime"
            onChange={handleTimeChange}
          />
          <MinuteSelector
            type={type}
            eventType="toTime"
            onChange={handleTimeChange}
          />
          <TimeCycleSelector
            type={type}
            eventType="toTime"
            onChange={handleTimeChange}
          />
        </div>
      </div>
    </div>
  );
}
