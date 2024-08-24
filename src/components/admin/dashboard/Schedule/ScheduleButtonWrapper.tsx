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
import { Input } from "@/components/ui/input";
import { CapitalizeFirstLetterOfWord } from "@/lib/utils";

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
          <>
            <Input placeholder={`${CapitalizeFirstLetterOfWord(type)} is blocked`} disabled className="my-1"/>
            <ScheduleUnblockButton scheduleId={data[type].id} type={type} />
          </>
        ) : (
          <>
            <ScheduleUpdateButton type={type} />
            <ScheduleDeleteButton type={type} />
          </>
        )}
      </div>
    </>
  );
}
