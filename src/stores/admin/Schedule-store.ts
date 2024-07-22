import { TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TScheduleOrganizedData } from "@/db/data/dto/schedule";
import { create } from "zustand";
import { createStore } from "zustand/vanilla";

export type ScheduleState = {
  packages: Exclude<TgetPackageScheduleDatas, null>;
  schedules: TScheduleOrganizedData;
};

export type ScheduleActions = {
  // stateAction: (param: TParam) => void
  setOrganizedData: (param: string) => void;
};

export type ScheduleStore = ScheduleState & ScheduleActions;

// export const initScheduleStore = (): ScheduleState => {
//   return { count: new Date().getFullYear() };
// };

// export const defaultInitState: ScheduleState = {
//   count: 0,
// };

export const createScheduleStore = (initScheduleStore: ScheduleState) => {
  return createStore<ScheduleStore>()((set) => ({
    ...initScheduleStore,
    setOrganizedData: (param) => {},
  }));
};
