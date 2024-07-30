import { Check, RefreshCw } from "lucide-react";
import React from "react";
import ScheduleInfoCard from "./ScheduleInfoCard";

export default function ScheduleButtonInfo() {
  return (
    <div className="flex mb-4 mt-4 gap-2  justify-center flex-wrap">
      <ScheduleInfoCard
        Icon={<RefreshCw className="h-4  w-4" />}
        lable="Update Existing Schedule"
      />
      <ScheduleInfoCard
        Icon={<Check className="h-4  w-4" />}
        lable="Create New Schedule"
      />
    </div>
  );
}
