import React from "react";
import {
  getSchedulesByDateOrNow,
  getUpcommingScheduleDates,
  TgetUpcommingScheduleDates,
} from "@/db/data/dto/schedule";
import { convertScheduleDataDateToDateString } from "@/lib/helpers/organizedData";
import { getUTCDate, RemoveTimeStampFromDate } from "@/lib/utils";
import ScheduleBar from "./ScheduleContainer";

export default async function ScheduleBarWrapper() {
  const data = await getUpcommingScheduleDates();
  const currentDate = new Date(Date.now());
  const date = RemoveTimeStampFromDate(
    new Date(getUTCDate(RemoveTimeStampFromDate(currentDate))),
  );

  const schedules = await getSchedulesByDateOrNow(date);
  const initialSchedule =
    schedules && schedules.map(convertScheduleDataDateToDateString);
  let UpcommingSchedule: TgetUpcommingScheduleDates = data ?? {
    breakfast: [],
    custom: [],
    dinner: [],
    lunch: [],
  };
  return (
    <ScheduleBar
      initialDate={date}
      initialSchedule={initialSchedule}
      upCommingSchedules={UpcommingSchedule}
    />
  );
}
