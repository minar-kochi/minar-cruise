import { RemoveTimeStampFromDate } from "@/lib/utils";
import { TScheduleState } from "./ScheduleSlice";
export const resetUpdates = {
  breakfast: false,
  lunch: false,
  sunset:false,
  dinner: false,
  custom: false,
};

export const initialState: Required<TScheduleState> = {
  currentDateSchedule: {
    breakfast: null,
    custom: null,
    sunset: null,
    dinner: null,
    lunch: null,
  },
  ScheduleDataRaw: [],
  date: RemoveTimeStampFromDate(new Date(Date.now())),
  isPopOverDateOpened: false,
  isChangedUpdated: resetUpdates,
  upCommingSchedules: {
    breakfast: [],
    custom: [],
    sunset: [],
    dinner: [],
    lunch: [],
  },
  updatedDateSchedule: {
    breakfast: {
      packageId: undefined,
      fromTime: undefined,
      toTime: undefined,
      scheduleTime: "BREAKFAST",
    },
    custom: {
      packageId: undefined,
      fromTime: undefined,
      toTime: undefined,
      scheduleTime: "CUSTOM",
    },
    sunset: {
      packageId: undefined,
      fromTime: undefined,
      toTime: undefined,
      scheduleTime: "SUNSET",
    },
    dinner: {
      packageId: undefined,
      fromTime: undefined,
      toTime: undefined,
      scheduleTime: "DINNER",
    },
    lunch: {
      packageId: undefined,
      fromTime: undefined,
      toTime: undefined,
      scheduleTime: "LUNCH",
    },
  },
};
