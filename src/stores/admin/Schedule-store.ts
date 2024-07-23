import { TselectDate } from "@/components/admin/dashboard/ScheduleSelector";
import { TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TgetUpcommingScheduleDates } from "@/db/data/dto/schedule";
import { organizeScheduleData } from "@/lib/helpers/organizedData";
import { TOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import { createStore } from "zustand/vanilla";

export type ScheduleState = {
  packages: Exclude<TgetPackageScheduleDatas, null>;
  UpcommingScheduleDates: TgetUpcommingScheduleDates;
  organizedSchedule?: TOrganizedScheduleData;
  selectedSchedulePackageId?: TselectDate;
  date: string;
};

export type ScheduleActions = {
  setOrganizedData: (param: TScheduleDataDayReplaceString[]) => void;
  updateSelectedSchedulePackageId: (
    param: keyof TselectDate,
    packageId: string
  ) => void;
  setDate: (param: string) => void;
};

export type ScheduleStore = ScheduleState & ScheduleActions;

export const createScheduleStore = (initScheduleStore: ScheduleState) => {
  return createStore<ScheduleStore>()((set) => ({
    ...initScheduleStore,
    setDate: (param) =>
      set({
        date: param,
      }),
    setOrganizedData: (data) => {
      const OrgData = organizeScheduleData({ data });
      if (!OrgData) return;
      set((state) => {
        return {
          ...state,
          organizedSchedule: OrgData,
          selectedSchedulePackageId: {
            breakfast: OrgData.breakfast?.packageId,
            custom: OrgData.custom?.packageId,
            dinner: OrgData.dinner?.packageId,
            lunch: OrgData.dinner?.packageId,
          },
        };
      });
    },
    updateSelectedSchedulePackageId: (param, packageId) => {
      set((state) => {
        console.log(state);
        return {
          ...state,
          selectedSchedulePackageId: {
            ...state.selectedSchedulePackageId,
            [param]: packageId,
          },
        };
      });
    },
  }));
};
