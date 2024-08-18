import { getOrganizedPackages } from "@/db/data/dto/package";
import {
  getSchedulesByDateOrNow,
  getUpcommingScheduleDates,
  TgetUpcommingScheduleDates,
} from "@/db/data/dto/schedule";
import { convertScheduleDataDateToDateString } from "@/lib/helpers/organizedData";
import { getUTCDate, RemoveTimeStampFromDate, sleep } from "@/lib/utils";
import StoreProvider from "@/providers/adminStore/StoreProvider";
import React, { Children, ReactNode } from "react";

export default async function InitialStateDispatcher({
  children,
}: {
  children: ReactNode;
}) {
  const packages = await getOrganizedPackages();
  if (!packages) return null;

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
    <StoreProvider
      Packages={packages}
      initialDate={date}
      initialSchedule={initialSchedule}
      upCommingSchedules={UpcommingSchedule}
    >
      {children}
    </StoreProvider>
  );
}
