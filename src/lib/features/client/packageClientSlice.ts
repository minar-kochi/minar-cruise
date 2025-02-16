// import { TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TGetPackageSearchItems } from "@/db/data/dto/package";
import { RemoveTimeStampFromDate } from "@/lib/utils";
import { TExcludedOrganizedPackageData } from "@/Types/packages/package";
import { ScheduleGrouped } from "@/Types/Schedule/ScheduleSelect";
import { $Enums } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export type TOrganizedPackage = Exclude<TgetPackageScheduleDatas, null>;

type TScheduleStuff = {
  id: string;
  packageId: string | null;
  day: string;
  schedulePackage: $Enums.SCHEDULED_TIME;
  scheduleStatus: $Enums.SCHEDULE_STATUS;
};

type TScheduleRAw = {
  schedules: TScheduleStuff[];
  nextCursor?: string | undefined;
}[];

type TScheduleResults = Record<string, TScheduleStuff[]>;

export type TPackageState = {
  searchPackages: TGetPackageSearchItems | null;
  selectedPackages: TGetPackageSearchItems;
  date: string | null;
  resultedSchedules: ScheduleGrouped;
};

const packageClientSlice = createSlice({
  name: "package",
  initialState: {
    date: null,
    searchPackages: [],
    selectedPackages: [],
    resultedSchedules: {},
  } as TPackageState,
  reducers: {
    setDate(state, action: PayloadAction<string>) {
      state.date = action.payload;
    },
    setInitialSelectedPackage(
      state,
      action: PayloadAction<TGetPackageSearchItems>,
    ) {
      state.selectedPackages = action.payload;
    },
    setSearchPackages(
      state,
      action: PayloadAction<TGetPackageSearchItems | null>,
    ) {
      state.searchPackages = action.payload;
    },
    setSelectedPackage(
      state,
      action: PayloadAction<TGetPackageSearchItems[number]>,
    ) {
      const index = state.selectedPackages.findIndex(
        (fv) => fv.id === action.payload.id,
      );
      if (index === -1) {
        state.selectedPackages.push(action.payload);
      } else {
        state.selectedPackages = state.selectedPackages.filter(
          (fv) => fv.id !== action.payload.id,
        );
      }
    },

    setSearchedPackages: {
      reducer(state, action: PayloadAction<{ data: ScheduleGrouped }>) {
        state.resultedSchedules = action.payload.data;
      },
      prepare(data: TScheduleRAw | undefined) {
        let organizedSchedules = data?.flatMap((item) => item.schedules) ?? [];

        const seen = new Set<string>();
        const uniqueSchedules = organizedSchedules.filter((schedule) => {
          const key = `${schedule.day}-${schedule.id}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        const groupedSchedules = uniqueSchedules.reduce((acc, schedule) => {
          const dateKey = new Date(schedule.day).toISOString().split("T")[0];
          (acc[dateKey] = acc[dateKey] || []).push(schedule);
          return acc;
        }, {} as ScheduleGrouped);

        return { payload: { data: groupedSchedules } };
      },
    },
  },
});

export const {
  setSearchPackages,
  setSelectedPackage,
  setInitialSelectedPackage,
  setDate,
  setSearchedPackages,
} = packageClientSlice.actions;
export default packageClientSlice.reducer;

// const groupedSchedules = items.reduce((acc, schedule) => {
//   const dateKey = schedule.day.toISOString().split("T")[0];
//   (acc[dateKey] = acc[dateKey] || []).push(schedule);
//   return acc;
// }, {} as ScheduleGrouped);
