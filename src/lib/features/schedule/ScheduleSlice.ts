import { dayKeyOfDateColumn, type IstDayKey } from "@/lib/datetime";
import { organizeScheduleData } from "@/lib/helpers/organizedData";
import {
  GroupedSchedulePackageData,
  TExcludedOrganizedUpComingSchedule,
  TIsScheduleChange,
  TKeyOrganizedScheduleData,
  TOrganizedScheduleData,
  TUpdatedDateSchedulePackageId,
  TSchedulePackageData,
  InfinitySchedulesWithBookingCount,
  InfinitySchedulePackageData,
  GroupedScheduleWithBookingCount,
} from "@/Types/Schedule/ScheduleSelect";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
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
   *
   * Branded so `tsc` finds any raw string reaching it. An ISO instant and an
   * IST day key are both `string` to the compiler, and mixing them is the
   * original bug this migration exists to remove.
   */
  date: IstDayKey;
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
  SchedulesWithBookingData: GroupedScheduleWithBookingCount;
} & TScheduleUtilsState;

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setScheduleForBooking: {
      reducer(
        state,
        action: PayloadAction<{ data: GroupedScheduleWithBookingCount }>,
      ) {
        state.SchedulesWithBookingData = action.payload.data;
      },
      prepare(data: InfinitySchedulesWithBookingCount[] | undefined) {
        const unformattedSchedulesArray =
          data?.flatMap((item) => item.response) ?? [];

        const uniqueScheduleKeys = new Set();
        const uniqueSchedules = unformattedSchedulesArray?.filter((item) => {
          const key = `${item.day}-${item.id}`;
          if (uniqueScheduleKeys.has(key)) return false;
          uniqueScheduleKeys.add(key);
          return true;
        });

        const formattedScheduleArray = uniqueSchedules?.reduce(
          (acc, schedule) => {
            // `schedule.day` is already an IstDayKey. The old expression round-tripped
          // it through a Date and back, which is a no-op only under TZ=UTC.
          const dateKey = schedule.day;
            (acc[dateKey] = acc[dateKey] || [])?.push(schedule);
            return acc;
          },
          {} as GroupedScheduleWithBookingCount,
        );

        return {
          payload: {
            data: formattedScheduleArray,
          },
        };
      },
    },
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
          // `schedule.day` is already an IstDayKey. The old expression round-tripped
          // it through a Date and back, which is a no-op only under TZ=UTC.
          const dateKey = schedule.day;
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
    setDate(state, action: PayloadAction<IstDayKey>) {
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
        // `data.day` is already an IstDayKey — the store is keyed by IST day.
        const date = data.day;

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
        // `data.day` is already an IstDayKey — the store is keyed by IST day.
        const date = data.day;
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
        // `data.day` is already an IstDayKey — the store is keyed by IST day.
        const date = data.day;
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
      // Picking a different package drops any manual time the admin had set,
      // so the new package's own departure applies.
      state.updatedDateSchedule[payload.type].startMinutes = undefined;
      state.updatedDateSchedule[payload.type].endMinutes = undefined;
    },
    /**
     * Set the departure or return for a schedule, as minutes from IST midnight.
     *
     * The payload used to be `{ time: string, eventType: "fromTime" | "toTime" }`
     * while the only dispatcher sent `{ field, minutes }` — a mismatch hidden by
     * an `as never` at the call site, so this wrote `undefined` to a key
     * literally named "undefined" and the admin's time never reached the store.
     */
    setUpdatableScheduleTime(
      state,
      action: PayloadAction<{
        type: TKeyOrganizedScheduleData;
        field: "startMinutes" | "endMinutes";
        minutes: number | null;
      }>,
    ) {
      const {
        payload: { type, field, minutes },
      } = action;
      if (
        !state.updatedDateSchedule[type].packageId &&
        state.currentDateSchedule[type]?.packageId
      ) {
        state.updatedDateSchedule[type].packageId =
          state.currentDateSchedule[type]?.packageId;
      }
      state.updatedDateSchedule[type][field] = minutes;
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
  setScheduleForBooking,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
