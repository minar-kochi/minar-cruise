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
  return <ScheduleBar />;
}
