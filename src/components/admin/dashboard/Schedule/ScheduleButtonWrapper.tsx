// import { TIsScheduleChange } from "@/Types/Schedule/ScheduleSelect";
// import { TScheduleSelector } from "@/Types/type";
import React from "react";
import ScheduleAddButton from "./ScheduleAddButton";
import ScheduleUpdateButton from "./ScheduleUpdateButton";
// import { TScheduleSelector } from "../../../../Types/type";
import { TScheduleSelector } from "@/Types/type";
import { useAppSelector } from "@/hooks/adminStore/reducer";

export default function ScheduleButtonWrapper({ type }: TScheduleSelector) {
  const data = useAppSelector((state) => state.schedule.currentDateSchedule);

  return !data[type]?.id ? (
    <ScheduleAddButton type={type} />
  ) : (
    <ScheduleUpdateButton type={type} />
  );
}
