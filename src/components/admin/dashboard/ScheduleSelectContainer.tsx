import React, { useState } from "react";
import ScheduleSelect from "./Schedule/ScheduleSelect";
import { TOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TScheduleSchema } from "@/lib/validators/ScheduleValidtor";
import ScheduleSelectorDynamic from "./ScheduleSelector2";
import { TselectDate } from "./ScheduleSelector";
import { useScheduleStore } from "@/providers/admin/schedule-store-provider";

interface IScheduleSelector {
  organizedScheduleData: TOrganizedScheduleData | null;
}

export default function ScheduleSelectContainer({
  organizedScheduleData,
}: IScheduleSelector) {
  const [selectedPackage, setSelectedPackageId] = useState<TselectDate | null>({
    breakfast: organizedScheduleData?.breakfast?.packageId,
    dinner: organizedScheduleData?.dinner?.packageId,
    lunch: organizedScheduleData?.lunch?.packageId,
    custom: organizedScheduleData?.custom?.packageId,
  });

  const packages = useScheduleStore((state) => state.packages);
  return (
    <div>
      <ScheduleSelectorDynamic
        type="breakfast"
        setSelectedPackageId={setSelectedPackageId}
        key={`${selectedPackage?.breakfast}-breakfast-${Math.random()}`}
        label="Breakfast"
        selected={organizedScheduleData?.breakfast}
        id={selectedPackage?.breakfast}
        packages={packages.BreakFast}
      />
      {/* <ScheduleSelectorDynamic
        type="lunch"
        setSelectedPackageId={setSelectedPackageId}
        key={`${selectedPackage?.lunch}-lunch-${Math.random()}`}
        selected={organizedScheduleData?.lunch}
        label="Lunch"
        id={selectedPackage?.lunch}
        packages={packages.Lunch}
      />
      <ScheduleSelectorDynamic
        key={`${selectedPackage?.dinner}-dinner-${Math.random()}`}
        type="dinner"
        id={selectedPackage?.dinner}
        setSelectedPackageId={setSelectedPackageId}
        label="Dinner"
        selected={organizedScheduleData?.dinner}
        packages={packages.Dinner}
      />

      <ScheduleSelectorDynamic
        key={`${selectedPackage?.custom}-dinner-${Math.random()}`}
        id={selectedPackage?.custom}
        type="custom"
        setSelectedPackageId={setSelectedPackageId}
        label="Custom Package"
        selected={organizedScheduleData?.custom}
        packages={packages.BreakFast.filter(
          (val) => val.packageCategory === "EXCLUSIVE"
        )}
      /> */}
    </div>
  );
}
