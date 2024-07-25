import React, { useState } from "react";
import ScheduleSelect from "./Schedule/ScheduleSelect";
import { TOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TScheduleSchema } from "@/lib/validators/ScheduleValidtor";
import ScheduleSelectorDynamic from "./ScheduleSelector2";
import { TselectDate } from "./ScheduleSelector";
import { useScheduleStore } from "@/providers/admin/schedule-store-provider";

interface IScheduleSelector {}

export default function ScheduleSelectContainer({}: IScheduleSelector) {
  const selectedPackage = useScheduleStore((state) => state.organizedSchedule);
  return (
    <div>
      <ScheduleSelectorDynamic
        key={`breakfast-01-${Math.random()}`}
        type="breakfast"
        id={selectedPackage?.breakfast?.packageId}
        packageKey={"BreakFast"}
        label="Breakfast"
      />
      <ScheduleSelectorDynamic
        key={`lunch-01-${Math.random()}`}
        type="lunch"
        id={selectedPackage?.lunch?.packageId}
        packageKey="Lunch"
        label="Lunch"
      />
      <ScheduleSelectorDynamic
        key={`dinner-01-${Math.random()}`}
        type="dinner"
        id={selectedPackage?.dinner?.packageId}
        packageKey="Dinner"
        label="Dinner"
      />
      <ScheduleSelectorDynamic
        key={`custom-01-${Math.random()}`}
        type="custom"
        packageKey="Custom"
        id={selectedPackage?.custom?.packageId}
        label="Custom"
      />
    </div>
  );
}
