import { istToday } from "@/lib/datetime";
import RouterRefreshButton from "@/components/admin/booking/RouterRefresh";
import OpenScheduleButton from "@/components/admin/dashboard/Schedule/OpenScheduleButton";
import { getOrganizedPackages } from "@/db/data/dto/package";
import {
  getSchedulesByDateOrNow,
  getupComingScheduleDates,
  TgetupComingScheduleDates,
} from "@/db/data/dto/schedule/schedule";
import { convertScheduleDataDateToDateString } from "@/lib/helpers/organizedData";
import StoreProvider from "@/providers/adminStore/StoreProvider";
import React, { ReactNode } from "react";

export default async function InitialStateDispatcher({
  children,
}: {
  children: ReactNode;
}) {
  // Today in IST. This was four representation hops —
  // `calendarDateToDayKey(new Date(getUTCDate(calendarDateToDayKey(now))))` —
  // that cancel out only when the host runs UTC. It is an SSR path, so the
  // wrong day would be baked into the admin shell.
  const date = istToday();
  const [packages, data, schedules] = await Promise.all([
    getOrganizedPackages(),
    getupComingScheduleDates(),
    getSchedulesByDateOrNow(date),
  ]);

  if (!packages) {
    return null;
  }

  const initialSchedule =
    schedules && schedules.map(convertScheduleDataDateToDateString);
  let upComingSchedule: TgetupComingScheduleDates = data ?? {
    breakfast: [],
    custom: [],
    sunset: [],
    dinner: [],
    lunch: [],
  };
  return (
    <StoreProvider
      Packages={packages}
      initialDate={date}
      initialSchedule={initialSchedule}
      upComingSchedules={upComingSchedule}
    >
      {children}
    </StoreProvider>
  );
}
