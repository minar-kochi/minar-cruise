// import { TIsScheduleChange } from "@/Types/Schedule/ScheduleSelect";
// import { TScheduleSelector } from "@/Types/type";
import React from "react";
import ScheduleAddButton from "./ScheduleAddButton";
import ScheduleUpdateButton from "./ScheduleUpdateButton";
// import { TScheduleSelector } from "../../../../Types/type";
import { TScheduleSelector } from "@/Types/type";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import { Button } from "@/components/ui/button";
import ScheduleBlockButton from "./ScheduleBlockButton";
import ScheduleUnblockButton from "./ScheduleUnblockButton";
import ScheduleDeleteButton from "./ScheduleDeleteButton";

export default function ScheduleButtonWrapper({ type }: TScheduleSelector) {
  const data = useAppSelector((state) => state.schedule.currentDateSchedule);

  return !data[type]?.id ? (
    <>
      <div className="my-2">
        <ScheduleAddButton type={type} />
      </div>
      <ScheduleBlockButton type={type} />
    </>
  ) : (
    <>
      <div className="my-2">
        {data[type]?.scheduleStatus === "BLOCKED" ? (
          <ScheduleUnblockButton scheduleId={data[type].id} type={type} />
        ) : null}
      </div>
      <ScheduleUpdateButton type={type} />
      <ScheduleDeleteButton type={type} />
    </>
  );
}
