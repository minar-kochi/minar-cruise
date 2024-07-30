import { organizeScheduleData } from "@/lib/helpers/organizedData";
import { weakMapMemoize } from "reselect";
import {
  TExcludedOrganizedUpcommingSchedule,
  TIsScheduleChange,
  TKeyOrganizedScheduleData,
  TOrganizedScheduleData,
  TUpdatedDateSchedulePackageId,
} from "@/Types/Schedule/ScheduleSelect";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import {  createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
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
   * Upcomming Schedules that are formatted in YYYY-MM-DD[]
   */
  upCommingSchedules: TExcludedOrganizedUpcommingSchedule;
  /**
   * Current date schedule that is synced with database. (do not change is value.)
   */
  currentDateSchedule: TOrganizedScheduleData;
  /**
   * Locally Store and Changable Date schedule.
   */
  updatedDateSchedule: TUpdatedDateSchedulePackageId;
  /**
   * to notify whether a Schedule is not same as in the database.
   */
  isChangedUpdated: TIsScheduleChange;
} & TScheduleUtilsState;

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    /**
     * @param state TSchedule
     * @param action string {YYYY-MM-DD} format string
     */
    setDate(state, action: PayloadAction<string>) {
      state.date = action.payload;
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
     * set the UpcommingOrganizedDates which is in (YYYY-MM-DD(organized))[]
     * @param action {TExcludedOrganizedUpcommingSchedule}
     */
    setInitialOrganizedScheduleDates(
      state,
      action: PayloadAction<TExcludedOrganizedUpcommingSchedule>
    ) {
      state.upCommingSchedules = action.payload;
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
      reducer(state, action: PayloadAction<TOrganizedScheduleData >) {
        state.currentDateSchedule = action.payload;
        state.updatedDateSchedule = initialState.updatedDateSchedule
      },
      /**
       * return data of the prepare is given back to the reducer to change the state,
       * do not calculate complex stuff in reducer it should be calculated in prepare func.
       * @param data TScheduleDataDayReplaceString 
       * @returns 
       */
      prepare(data: TScheduleDataDayReplaceString[] | null) {
        if(!data) return {payload: initialState.currentDateSchedule}
        const OrgData = organizeScheduleData({ data });
        return {
          payload: OrgData,
        };
      },
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
      }>
    ) {
      const { payload } = action;
      state.updatedDateSchedule[payload.type].packageId = payload.packageId;
    },
    /**
     * turn up incase if a schedule is set to be changed.
     * @param action
     */
    setUpdatedDateSchedule(
      state,
      action: PayloadAction<{ type: TKeyOrganizedScheduleData }>
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
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
