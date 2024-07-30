"use client";
import { TExcludedOrganizedPackageData } from "@/Types/packages/package";
import React from "react";
import ScheduleSelect from "./ScheduleSelect";
import { TScheduleSelector } from "@/Types/type";
import ScheduleAddButton from "./ScheduleAddButton";
import { useAppSelector, useAppStore } from "@/hooks/adminStore/reducer";
import { useDefaultMergedSchedule } from "@/lib/features/schedule/selector";
import { useIsIdExclusive } from "@/lib/features/Package/selector";
export type TKeyOrganized = keyof TExcludedOrganizedPackageData;
export default function ScheduleSelector({ type }: TScheduleSelector) {
  const defaultSelect = useAppSelector((state) =>
    useDefaultMergedSchedule(state, type)
  );
  const isExclusive = useAppSelector((state) =>
    useIsIdExclusive(state, defaultSelect.packageId, type)
  );
  return (
    <div className="my-2">
      <label htmlFor="" className="my-0.5">
        Lunch
      </label>
      <div className="flex  gap-2">
        <ScheduleSelect type={type} />
        <ScheduleAddButton />
      </div>
      <div>Exclusive {JSON.stringify(isExclusive)} </div>
    </div>
  );
}
