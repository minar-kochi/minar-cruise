import { istMinutesOfInstant } from "@/lib/datetime";
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

/**
 * The departure/return a CUSTOM or EXCLUSIVE schedule should show in the admin
 * form, as minutes from IST midnight.
 *
 * Derived from the stored instants. This used to read two `"4:30:PM"` strings
 * and re-split them into {hours, min, Cycle} to drive three dropdowns; the
 * strings no longer exist, and a single time input needs only the minute count.
 */
export type TScheduleTimer = {
  changed: boolean;
  startMinutes: number | null;
  endMinutes: number | null;
} | null;

function timerFromInstants(
  startsAt: Date | null | undefined,
  endsAt: Date | null | undefined,
): TScheduleTimer {
  if (!startsAt) return null;
  return {
    startMinutes: istMinutesOfInstant(startsAt),
    endMinutes: endsAt ? istMinutesOfInstant(endsAt) : null,
    changed: false,
  };
}

export const currentScheduleTimer = createSelector(
  [CurrentSchedule, (_, type: TKeyOrganizedScheduleData) => type],
  (currentDateSchedule, type): TScheduleTimer =>
    timerFromInstants(
      currentDateSchedule[type]?.startsAt,
      currentDateSchedule[type]?.endsAt,
    ),
);

export const DefaultMergedScheduleTimer = createSelector(
  [Schedule, (_, type: TKeyOrganizedScheduleData) => type],
  ({ currentDateSchedule }, type): TScheduleTimer =>
    timerFromInstants(
      currentDateSchedule[type]?.startsAt,
      currentDateSchedule[type]?.endsAt,
    ),
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
    // Dirty-check the sailing times by comparing the instants directly.
    // This compared two "4:30:PM" strings before; instants compare by value
    // with getTime() and cannot differ only by formatting.
    const currentStart = currentDateSchedule[type]?.startsAt ?? null;
    const updatedStart = updatedDateSchedule[type]?.startsAt ?? null;
    const currentEnd = currentDateSchedule[type]?.endsAt ?? null;
    const updatedEnd = updatedDateSchedule[type]?.endsAt ?? null;

    if (currentStart?.getTime() !== updatedStart?.getTime()) {
      Changed.isTimeChanged = true;
    }
    if (currentEnd?.getTime() !== updatedEnd?.getTime()) {
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
