// import { TTimeCycle } from "@/components/admin/dashboard/Schedule/ExclusiveScheduleTime";
import { RootState } from "@/lib/store/adminStore";
import { splitTimeColon } from "@/lib/utils";
import { TKeyOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { TScheduleDataDayReplaceString, TTimeCycle } from "@/Types/type";
import { createSelector } from "@reduxjs/toolkit";
import { Fascinate } from "next/font/google";
import toast from "react-hot-toast";
import { Packages } from "../Package/selector";
import { isStatusBreakfast } from "@/lib/validators/Schedules";

export const Schedule = (state: RootState) => state.schedule;

export const CurrentSchedule = (state: RootState) =>
  state.schedule.currentDateSchedule;

type d = { value: string; label: string };
export const scheduleIdAndPackageTitleSelector = createSelector(
  [CurrentSchedule, Packages],
  (currentSchedule, packages): { value: string; label: string }[] => {
    let allSchedule = [
      currentSchedule.breakfast,
      currentSchedule.custom,
      currentSchedule.dinner,
      currentSchedule.lunch,
    ];

    let AllPackages = [
      ...packages.breakfast,
      ...packages.custom,
      ...packages.dinner,
      ...packages.lunch,
    ];

    let filteredNull = allSchedule.filter(
      (fv) => fv && fv?.scheduleStatus !== "BLOCKED",
    ) as TScheduleDataDayReplaceString[];

    let data: d[] = filteredNull.map((item) => {
      const packageName = AllPackages.find((fv) => fv.id === item.packageId);
      return {
        value: item.id,
        label: packageName?.title ?? item.scheduleStatus,
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

// type d = { value: string; lable: string };
// export const scheduleIdAndPackageTitleSelector = createSelector(
//   [CurrentSchedule, Packages, (_, __, type: TKeyOrganizedScheduleData) => type],
//   (currentschedule, packages, hello): { value: string; lable: string }[] => {
//     let allSchedule = [
//       currentschedule.breakfast,
//       currentschedule.custom,
//       currentschedule.dinner,
//       currentschedule.lunch,
//     ];
//     let AllPackages = [
//       ...packages.breakfast,
//       ...packages.custom,
//       ...packages.dinner,
//       ...packages.lunch,
//     ];

//     let filteredNull = allSchedule.filter(
//       (fv) => fv && isStatusBreakfast,
//     ) as TScheduleDataDayReplaceString[];

//     let data: d[] = filteredNull.map((item) => {
//       const packageName = AllPackages.find((fv) => fv.id === item.packageId);
//       return {
//         value: item.id,
//         lable: packageName?.title ?? item.scheduleStatus,
//       };
//     });
//     return data;
//   },
// );

// export const Merged = (state: RootState) => state.schedule;

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
      changed: true,
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
