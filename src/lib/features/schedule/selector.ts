import { RootState } from "@/lib/store/adminStore";
import { splitTimeColon } from "@/lib/utils";
import { TKeyOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { TScheduleDataDayReplaceString, TTimeCycle } from "@/Types/type";
import { createSelector } from "@reduxjs/toolkit";
import { Packages } from "../Package/selector";
import { TKeyOrganized } from "@/components/admin/dashboard/Schedule/ScheduleSelector";
import { duration } from "moment";
import { NUMBER_MATCH } from "@/lib/helpers/regex";
import { getPackageTitleWithTimeIfNotExists } from "@/lib/Data/manipulators/PackageManipulators";

export const Schedule = (state: RootState) => state.schedule;
export const ModalSelect = (state: RootState) => state.modalStore.isModalOpen;
export const selectModal = createSelector([ModalSelect], (state) => state);
export const CurrentSchedule = (state: RootState) =>
  state.schedule.currentDateSchedule;

type TSelectBoxValueLableSelector = { value: string; label: string };
export const scheduleIdAndPackageTitleSelector = createSelector(
  [CurrentSchedule, Packages],
  (currentSchedule, packages): { value: string; label: string }[] => {
    let allSchedule = [
      currentSchedule.breakfast,
      currentSchedule.custom,
      currentSchedule.dinner,
      currentSchedule.lunch,
      currentSchedule.sunset,
    ];

    let AllPackages = [
      ...packages.breakfast,
      ...packages.custom,
      ...packages.dinner,
      ...packages.lunch,
      ...packages.sunset,
    ];

    let filteredNull = allSchedule.filter(
      (fv) => fv && fv?.scheduleStatus !== "BLOCKED",
    ) as TScheduleDataDayReplaceString[];

    let data: TSelectBoxValueLableSelector[] = filteredNull.map((item) => {
      const packageName = AllPackages.find((fv) => fv.id === item.packageId);
      let title = packageName
        ? getPackageTitleWithTimeIfNotExists(
            packageName.title,
            packageName.duration,
            packageName.packageCategory,
          )
        : "";
      return {
        value: item.id,
        label: title ?? item.scheduleStatus,
      };
    });
    return data;
  },
);

export const UpdatedSchedule = createSelector(
  [Schedule, (item, type: TKeyOrganizedScheduleData) => type],
  ({ currentDateSchedule, updatedDateSchedule }, type): boolean => {
    let currentState = updatedDateSchedule && updatedDateSchedule[type];

    let dbState = currentDateSchedule && currentDateSchedule[type];

    if (currentState?.packageId !== dbState?.id) return false;

    return true;
  },
);

export const DefaultMergedSchedule = createSelector(
  [Schedule, (_, type: TKeyOrganizedScheduleData) => type],
  (
    { currentDateSchedule, updatedDateSchedule, date },
    type,
  ): { packageId: string | null; changed: boolean } => {
    if (
      updatedDateSchedule[type] &&
      updatedDateSchedule[type].packageId &&
      typeof updatedDateSchedule[type].packageId === "string"
    ) {
      return {
        packageId: updatedDateSchedule[type].packageId,
        changed: true,
      };
    }

    return {
      packageId: currentDateSchedule[type]?.packageId ?? null,
      changed: false,
    };
  },
);

export const currentScheduleTimer = createSelector(
  [CurrentSchedule, (_, type: TKeyOrganizedScheduleData) => type],
  (
    currentDateSchedule,
    type,
  ): {
    changed: boolean;
    value: {
      fromTime: TTimeCycle;
      toTime: TTimeCycle;
    };
  } | null => {
    if (currentDateSchedule[type]) {
      let fromTime = currentDateSchedule[type]?.fromTime;
      let toTime = currentDateSchedule[type]?.toTime;
      if (typeof toTime !== "string" || typeof fromTime !== "string")
        return null;
      const from = splitTimeColon(fromTime);
      const to = splitTimeColon(toTime);
      if (!from || !to) return null;
      return {
        value: {
          fromTime: from,
          toTime: to,
        },
        changed: false,
      };
    }
    return null;
  },
);
export const DefaultMergedScheduleTimer = createSelector(
  [Schedule, (_, type: TKeyOrganizedScheduleData) => type],
  (
    { currentDateSchedule, updatedDateSchedule, date },
    type,
  ): {
    changed: boolean;
    value: {
      fromTime: TTimeCycle;
      toTime: TTimeCycle;
    };
  } | null => {
    if (currentDateSchedule[type]) {
      let fromTime = currentDateSchedule[type]?.fromTime;
      let toTime = currentDateSchedule[type]?.toTime;
      if (typeof toTime !== "string" || typeof fromTime !== "string")
        return null;
      const from = splitTimeColon(fromTime);
      const to = splitTimeColon(toTime);
      if (!from || !to) return null;
      return {
        value: {
          fromTime: from,
          toTime: to,
        },
        changed: false,
      };
    }
    if (updatedDateSchedule[type].packageId) {
      let fromTime = updatedDateSchedule[type]?.fromTime;
      let toTime = updatedDateSchedule[type]?.toTime;
      if (typeof toTime !== "string" || typeof fromTime !== "string")
        return null;
      const from = splitTimeColon(fromTime);
      const to = splitTimeColon(toTime);
      if (!from || !to) return null;
      return {
        value: {
          fromTime: from,
          toTime: to,
        },
        changed: false,
      };
    }

    return null;
  },
);

export type TIsScheduleInputsChanged = {
  isTimeOnlyChanged: Boolean;
  isPackageOnlyChanged: Boolean;
  isAllChanged: Boolean;
  packageId: Boolean;
  isTimeChanged: Boolean;
  isAnyChanged: Boolean;
};
export const isScheduleInputsChanged = createSelector(
  [Schedule, (_, type: TKeyOrganized) => type],
  (
    { currentDateSchedule, updatedDateSchedule },
    type,
  ): TIsScheduleInputsChanged => {
    let Changed = {
      isTimeOnlyChanged: false,
      isPackageOnlyChanged: false,
      isAllChanged: false,
      packageId: false,
      isTimeChanged: false,
      isAnyChanged: false,
    };
    // if package id is changed.
    if (
      currentDateSchedule[type]?.packageId !==
      updatedDateSchedule[type]?.packageId
    ) {
      Changed.packageId = true;
    }
    // if from time is changed
    if (
      updatedDateSchedule[type]?.fromTime &&
      currentDateSchedule[type]?.fromTime !==
        updatedDateSchedule[type]?.fromTime
    ) {
      Changed.isTimeChanged = true;
    }
    // if to time is changed
    // console.log(currentDateSchedule[type]?.toTime,updatedDateSchedule[type]?.toTime)
    if (
      updatedDateSchedule[type]?.toTime &&
      currentDateSchedule[type]?.toTime !== updatedDateSchedule[type]?.toTime
    ) {
      Changed.isTimeChanged = true;
    }

    // if time and package is changed
    if (Changed.packageId && Changed.isTimeChanged) {
      Changed.isAllChanged = true;
    }

    // if time only Change.
    if (!Changed.packageId && Changed.isTimeChanged) {
      Changed.isTimeOnlyChanged = true;
    }

    // if package only Change
    if (Changed.packageId && !Changed.isTimeOnlyChanged) {
      Changed.isPackageOnlyChanged = true;
    }

    if (Changed.packageId || Changed.isTimeOnlyChanged) {
      Changed.isAnyChanged = true;
    }
    // console.log(Changed);
    return Changed;
  },
);
/**
 * if nothing on database then its a new state
 * if there is something on database then its updating state.
 *
 * there can be a multiple state.
 * one to store the database state.
 * one to store the changed state.
 *
 *
 */

// let defaultOrSelect = useMemo(() => {
//   return selectedSchedulePackageId && selectedSchedulePackageId[type]?.id
//     ? selectedSchedulePackageId[type]?.id
//     : organizedSchedule && organizedSchedule[type]?.packageId
//     ? organizedSchedule[type]?.packageId
//     : "";
// }, [selectedSchedulePackageId, organizedSchedule]);
