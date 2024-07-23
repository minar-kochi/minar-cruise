"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type ScheduleStore,
  createScheduleStore,
} from "@/stores/admin/Schedule-store";
import { TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TgetUpcommingScheduleDates } from "@/db/data/dto/schedule";
import { RemoveTimeStampFromDate } from "@/lib/utils";

export type ScheduleStoreApi = ReturnType<typeof createScheduleStore>;

export const ScheduleStoreContext = createContext<ScheduleStoreApi | undefined>(
  undefined
);

export interface IScheduleStoreProviderProps {
  children: ReactNode;
  packages: Exclude<TgetPackageScheduleDatas, null>;
  UpcommingScheduleDates: TgetUpcommingScheduleDates;
}

export const ScheduleStoreProvider = ({
  children,
  packages,
  UpcommingScheduleDates,
}: IScheduleStoreProviderProps) => {
  const storeRef = useRef<ScheduleStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createScheduleStore({
      packages,
      UpcommingScheduleDates,
      date: (() => {
        let DateStringFormated = RemoveTimeStampFromDate(new Date(Date.now()));
        return DateStringFormated;
      })(),
    });
  }

  return (
    <ScheduleStoreContext.Provider value={storeRef.current}>
      {children}
    </ScheduleStoreContext.Provider>
  );
};

export const useScheduleStore = <T,>(
  selector: (store: ScheduleStore) => T
): T => {
  const scheduleStoreContext = useContext(ScheduleStoreContext);

  if (!scheduleStoreContext) {
    throw new Error(
      `useScheduleStore must be used within CounterStoreProvider`
    );
  }

  return useStore(scheduleStoreContext, selector);
};
