"use client";
import { TExcludedOrganizedPackageData } from "@/Types/packages/package";
import ScheduleButtonWrapper from "./ScheduleButtonWrapper";
import React from "react";
import ScheduleSelect from "./ScheduleSelect";
import { TScheduleSelector } from "@/Types/type";
import ExclusiveScheduleTime from "./ExclusiveScheduleTime";
import { Button } from "@/components/ui/button";
export type TKeyOrganized = keyof TExcludedOrganizedPackageData;
export default function ScheduleSelector({
  type,
  label,
}: TScheduleSelector & { label: string }) {
  return (
    <div className="my-2 transition-all duration-500 ease-in-out">
      <label htmlFor="" className="my-0.5">
        {label}
      </label>
      <div className="flex gap-2">
        <ScheduleSelect
          key={`ScheduleSelect-select-box-type-${type}-`}
          type={type}
        />
      </div>
      <div className="my-2">
        <ExclusiveScheduleTime type={type} />
      </div>
      <ScheduleButtonWrapper type={type} />
    </div>
  );
}
