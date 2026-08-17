import { istToday } from "@/lib/datetime";
import { TScheduleState } from "./ScheduleSlice";
export const resetUpdates = {
  breakfast: false,
  lunch: false,
  sunset: false,
  dinner: false,
  custom: false,
};

export const initialState: Required<TScheduleState> = {
  AllSchedulesByDate: {},
  SchedulesWithBookingData: {},
  currentDateSchedule: {
    breakfast: null,
    custom: null,
    sunset: null,
    dinner: null,
    lunch: null,
  },
  ScheduleDataRaw: [],
  date: istToday(),
  isPopOverDateOpened: false,
  isChangedUpdated: resetUpdates,
  upComingSchedules: {
    breakfast: [],
    custom: [],
    sunset: [],
    dinner: [],
    lunch: [],
  },
  updatedDateSchedule: {
    breakfast: {
      packageId: undefined,
      startMinutes: undefined,
      endMinutes: undefined,
      scheduleTime: "BREAKFAST",
    },
    custom: {
      packageId: undefined,
      startMinutes: undefined,
      endMinutes: undefined,
      scheduleTime: "CUSTOM",
    },
    sunset: {
      packageId: undefined,
      startMinutes: undefined,
      endMinutes: undefined,
      scheduleTime: "SUNSET",
    },
    dinner: {
      packageId: undefined,
      startMinutes: undefined,
      endMinutes: undefined,
      scheduleTime: "DINNER",
    },
    lunch: {
      packageId: undefined,
      startMinutes: undefined,
      endMinutes: undefined,
      scheduleTime: "LUNCH",
    },
  },
};
