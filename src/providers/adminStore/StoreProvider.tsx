"use client";
import {
  setCurrentScheduleDate,
  setDate,
  setInitialOrganizedScheduleDates,
} from "@/lib/features/schedule/ScheduleSlice";
import { AppStore, makeStore } from "@/lib/store/adminStore";
import { RemoveTimeStampFromDate } from "@/lib/utils";
import { useRef } from "react";
import { Provider } from "react-redux";
import { setOrganizedPackage } from "@/lib/features/Package/packageSlice";
import { TExcludedOrganizedPackageData } from "@/Types/packages/package";
import { TExcludedOrganizedUpcommingSchedule } from "@/Types/Schedule/ScheduleSelect";
import { TScheduleDataDayReplaceString } from "@/Types/type";

export default function StoreProvider({
  children,
  Packages,
  initialDate,
  initialSchedule,
  upCommingSchedules,
}: {
  Packages: Exclude<TExcludedOrganizedPackageData, null>;
  children: React.ReactNode;
  initialDate: string;
  initialSchedule: TScheduleDataDayReplaceString[] | null;
  upCommingSchedules: TExcludedOrganizedUpcommingSchedule;
}) {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    storeRef.current = makeStore();

    // const date = RemoveTimeStampFromDate(new Date(Date.now()));

    storeRef.current.dispatch(
      setInitialOrganizedScheduleDates(upCommingSchedules),
    );

    storeRef.current.dispatch(setCurrentScheduleDate(initialSchedule));

    storeRef.current.dispatch(setDate(initialDate));

    if (Packages) {
      storeRef.current.dispatch(setOrganizedPackage(Packages));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
