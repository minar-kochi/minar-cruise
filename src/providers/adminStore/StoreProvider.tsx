"use client";
import {
  setCurrentScheduleDate,
  setDate,
  setInitialOrganizedScheduleDates,
} from "@/lib/features/schedule/ScheduleSlice";
import { AppStore, makeStore } from "@/lib/store/adminStore";
import { useRef } from "react";
import { Provider } from "react-redux";
import { setOrganizedPackage } from "@/lib/features/Package/packageSlice";
import { TExcludedOrganizedPackageData } from "@/Types/packages/package";
import { TExcludedOrganizedUpcommingSchedule } from "@/Types/Schedule/ScheduleSelect";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import RouterRefreshButton from "@/components/admin/booking/RouterRefresh";
import OpenScheduleButton from "@/components/admin/dashboard/Schedule/OpenScheduleButton";

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
    storeRef.current.dispatch(
      setInitialOrganizedScheduleDates(upCommingSchedules),
    );
    storeRef.current.dispatch(setCurrentScheduleDate(initialSchedule));
    storeRef.current.dispatch(setDate(initialDate));
    if (Packages) {
      storeRef.current.dispatch(setOrganizedPackage(Packages));
    }
  }

  return (
    <Provider store={storeRef.current}>
      {/* <RouterRefreshButton />
      <OpenScheduleButton /> */}
      {children}
    </Provider>
  );
}
