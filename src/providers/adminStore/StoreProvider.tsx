"use client";
import { setDate } from "@/lib/features/schedule/ScheduleSlice";
import { AppStore, makeStore } from "@/lib/store/adminStore";
import { RemoveTimeStampFromDate } from "@/lib/utils";
import { useRef } from "react";
import { Provider } from "react-redux";
import { setOrganizedPackage } from "@/lib/features/Package/packageSlice";
import { TExcludedOrganizedPackageData } from "@/Types/packages/package";

export default function StoreProvider({
  children,
  Packages,
}: {
  Packages: Exclude<TExcludedOrganizedPackageData, null>;
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    const date = RemoveTimeStampFromDate(new Date(Date.now()));
    storeRef.current.dispatch(setDate(date));
    if (Packages) {
      storeRef.current.dispatch(setOrganizedPackage(Packages));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
