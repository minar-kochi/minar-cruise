import { RemoveTimeStampFromDate } from "@/lib/utils";
import { TScheduleState } from "./ScheduleSlice";
export const resetUpdates = {
  breakfast: false,
  lunch: false,
  dinner: false,
  custom: false,
};

export const initialState: TScheduleState = {
  currentDateSchedule: {
    breakfast: null,
    custom: null,
    dinner: null,
    lunch: null,
  },
  date: RemoveTimeStampFromDate(new Date(Date.now())),
  isPopOverDateOpened: false,
  isChangedUpdated: resetUpdates,
  upCommingSchedules: {
    breakfast: [],
    custom: [],
    dinner: [],
    lunch: [],
  },
  updatedDateSchedule: {
    breakfast: {
      packageId: null,
      scheduleTime: "BREAKFAST",
    },
    custom: {
      packageId: null,
      scheduleTime: "CUSTOM",
    },
    dinner: {
      packageId: null,
      scheduleTime: "DINNER",
    },
    lunch: {
      packageId: null,
      scheduleTime: "LUNCH",
    },
  },
};
