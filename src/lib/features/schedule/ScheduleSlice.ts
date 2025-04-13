import { organizeScheduleData } from "@/lib/helpers/organizedData";
import {
  GroupedSchedulePackageData,
  TExcludedOrganizedUpComingSchedule,
  TIsScheduleChange,
  TKeyOrganizedScheduleData,
  TOrganizedScheduleData,
  TUpdatedDateSchedulePackageId,
  TSchedulePackageData,
  InfinitySchedulePackageData,
} from "@/Types/Schedule/ScheduleSelect";
import { TkeyDbTime, TScheduleDataDayReplaceString } from "@/Types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { RemoveTimeStampFromDate } from "@/lib/utils";
import { $Enums } from "@prisma/client";

export type TScheduleUtilsState = {
  /**
   * Popover state variable
   */
  isPopOverDateOpened: boolean;
};

export type TScheduleState = {
  /**
   * Date that is selected and currentDateSchedule is synced with.
   */
  date: string;
  /**
   * upComing Schedules that are formatted in YYYY-MM-DD[]
   */
  upComingSchedules: TExcludedOrganizedUpComingSchedule;
  /**
   * Current date schedule that is synced with database. (do not change is value.) but you can sync it with database.
   */
  currentDateSchedule: TOrganizedScheduleData;
  ScheduleDataRaw: TScheduleDataDayReplaceString[] | [];
  /**
   * Locally Store and Changeable Date schedule.
   */
  updatedDateSchedule: TUpdatedDateSchedulePackageId;
  /**
   * to notify whether a Schedule is not same as in the database.
   */
  isChangedUpdated: TIsScheduleChange;
  AllSchedulesByDate: GroupedSchedulePackageData;
} & TScheduleUtilsState;

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setAllScheduleByDate: {
      reducer(
        state,
        action: PayloadAction<{ data: GroupedSchedulePackageData }>,
      ) {
        state.AllSchedulesByDate = action.payload.data;
      },
      prepare(data: InfinitySchedulePackageData[] | undefined) {
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
          (acc[dateKey] = acc[dateKey] || [])?.push(schedule);
          return acc;
        }, {} as GroupedSchedulePackageData);
        return {
          payload: { data: groupedSchedules },
        };
      },
    },

    /**
     * @param state TSchedule
     * @param action string {YYYY-MM-DD} format string
     */
    setDate(state, action: PayloadAction<string>) {
      state.date = action.payload;
    },
    /**
     * set the Current Schedule according to the selected Date.
     * @param action
     */

    setCurrentScheduleDate: {
      /**
       * Special type how this works is return of prepare will get back into reducer.
       * @param state
       * @param action
       */
      reducer(state, action: PayloadAction<TOrganizedScheduleData>) {
        state.currentDateSchedule = action.payload;
        state.updatedDateSchedule = initialState.updatedDateSchedule;
      },
      /**
       * return data of the prepare is given back to the reducer to change the state,
       * do not calculate complex stuff in reducer it should be calculated in prepare func.
       * @param data TScheduleDataDayReplaceString
       * @returns
       */
      prepare(data: TScheduleDataDayReplaceString[] | null) {
        if (!data) return { payload: initialState.currentDateSchedule };
        const OrgData = organizeScheduleData({ data });
        return {
          payload: OrgData,
        };
      },
    },
    setSyncDatabaseDeleteSchedule: {
      reducer(
        state,
        action: PayloadAction<{
          updatingDate: string;
          currentDateSchedule: TScheduleDataDayReplaceString;
          type: TKeyOrganizedScheduleData;
          scheduleStatus: $Enums.SCHEDULE_STATUS;
        }>,
      ) {
        const { payload } = action;
        const { currentDateSchedule, scheduleStatus, type, updatingDate } =
          payload;
        //Filtering out the dates that are removed.
        if (state.date === action.payload.updatingDate) {
          const newFilteredUpComingScheduleDate = state.upComingSchedules[
            type
          ].filter((fv) => fv.date !== updatingDate);

          //removing the date from the deleted State
          state.upComingSchedules[type] = newFilteredUpComingScheduleDate;
        }
        state.currentDateSchedule[type] = null;
      },
      prepare(
        data: TScheduleDataDayReplaceString,
        type: TKeyOrganizedScheduleData,
      ) {
        const date = RemoveTimeStampFromDate(new Date(data.day));

        return {
          payload: {
            updatingDate: date,
            currentDateSchedule: data,
            type,
            scheduleStatus: data.scheduleStatus,
          },
        };
      },
    },
    setSyncDatabaseUpdatesScheduleCreation: {
      reducer(
        state,
        action: PayloadAction<{
          updatingDate: string;
          currentDateSchedule: TScheduleDataDayReplaceString;
          type: TKeyOrganizedScheduleData;
          scheduleStatus: $Enums.SCHEDULE_STATUS;
        }>,
      ) {
        //if dates are eq then add to the current date schedule.
        if (state.date === action.payload.updatingDate) {
          state.currentDateSchedule[action.payload.type] =
            action.payload.currentDateSchedule;
        }
        state.upComingSchedules[action.payload.type].push({
          date: action.payload.updatingDate,
          status: action.payload.scheduleStatus,
        });
      },
      prepare(
        data: TScheduleDataDayReplaceString,
        type: TKeyOrganizedScheduleData,
      ) {
        const date = RemoveTimeStampFromDate(new Date(data.day));
        return {
          payload: {
            updatingDate: date,
            currentDateSchedule: data,
            type,
            scheduleStatus: data.scheduleStatus,
          },
        };
      },
    },
    setSyncDatabaseUpdatesScheduleDeletion: {
      reducer(
        state,
        action: PayloadAction<{
          updatingDate: string;
          currentDateSchedule: TScheduleDataDayReplaceString;
          type: TKeyOrganizedScheduleData;
          scheduleStatus: $Enums.SCHEDULE_STATUS;
        }>,
      ) {
        //if dates are eq then add to the current date schedule.
        if (state.date === action.payload.updatingDate) {
          state.currentDateSchedule[action.payload.type] = null;
        }
        state.upComingSchedules[action.payload.type] = state.upComingSchedules[
          action.payload.type
        ].filter((fv) => fv.date !== action.payload.updatingDate);
      },
      prepare(
        data: TScheduleDataDayReplaceString,
        type: TKeyOrganizedScheduleData,
      ) {
        const date = RemoveTimeStampFromDate(new Date(data.day));
        return {
          payload: {
            updatingDate: date,
            currentDateSchedule: data,
            type,
            scheduleStatus: data.scheduleStatus,
          },
        };
      },
    },
    /**
     * if there is boolean then it will set the boolean or else it will toggle the previous state.
     * @param action boolean | null
     * @returns
     */
    setPopOverDateToggle(state, action: PayloadAction<boolean | null>) {
      // if there is action then use the action
      if (typeof action?.payload === "boolean") {
        state.isPopOverDateOpened = action?.payload;
      } else {
        //or use the toggle the previous state.
        state.isPopOverDateOpened = !state.isPopOverDateOpened;
      }
    },
    /**
     * set the upComingOrganizedDates which is in (YYYY-MM-DD(organized))[]
     * @param action {TExcludedOrganizedUpComingSchedule}
     */
    setInitialOrganizedScheduleDates(
      state,
      action: PayloadAction<TExcludedOrganizedUpComingSchedule>,
    ) {
      state.upComingSchedules = action.payload;
    },

    /**
     * This will change the locally selected package's according to their id and type.
     * @param state
     * @param action
     */
    setUpdatableScheduleDate(
      state,
      action: PayloadAction<{
        type: TKeyOrganizedScheduleData;
        packageId: string;
      }>,
    ) {
      const { payload } = action;
      state.updatedDateSchedule[payload.type].packageId = payload.packageId;
      state.updatedDateSchedule[payload.type].fromTime = undefined;
      state.updatedDateSchedule[payload.type].toTime = undefined;
    },
    /**
     * Set the Schedule Hour for specific time (fromTime / toTime)
     * @param state
     * @param action
     */
    setUpdatableScheduleTime(
      state,
      action: PayloadAction<{
        type: TKeyOrganizedScheduleData;
        time: string;
        eventType: TkeyDbTime;
        packageId?: string;
      }>,
    ) {
      const {
        payload: { time, type, eventType },
      } = action;
      if (
        !state.updatedDateSchedule[type].packageId &&
        state.currentDateSchedule[type]?.packageId
      ) {
        state.updatedDateSchedule[type].packageId =
          state.currentDateSchedule[type]?.packageId;
      }
      state.updatedDateSchedule[type][eventType] = time;
    },

    /**
     * turn up incase if a schedule is set to be changed.
     * @param action
     */
    setUpdatedDateSchedule(
      state,
      action: PayloadAction<{ type: TKeyOrganizedScheduleData }>,
    ) {
      let { type } = action.payload;
      state.isChangedUpdated[type] = false;
    },
  },
});

export const {
  setDate,
  setPopOverDateToggle,
  setInitialOrganizedScheduleDates,
  setCurrentScheduleDate,
  setUpdatedDateSchedule,
  setUpdatableScheduleDate,
  setUpdatableScheduleTime,
  setSyncDatabaseUpdatesScheduleCreation,
  setSyncDatabaseDeleteSchedule,
  setSyncDatabaseUpdatesScheduleDeletion,
  setAllScheduleByDate,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
