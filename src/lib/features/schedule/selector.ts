import { RootState } from "@/lib/store/adminStore";
import { TKeyOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { createSelector } from "@reduxjs/toolkit";
import { Fascinate } from "next/font/google";

export const Item = (state: RootState) => state.schedule;

export const useUpdatedSchedule = createSelector(
  [Item, (item, type: TKeyOrganizedScheduleData) => type],
  ({ currentDateSchedule, updatedDateSchedule }, type): boolean => {
    let currentState = updatedDateSchedule && updatedDateSchedule[type];
    let dbState = currentDateSchedule && currentDateSchedule[type];
    if (currentState?.packageId !== dbState?.id) return false;
    return true;
  },
);

export const Merged = (state: RootState) => state.schedule;

export const useDefaultMergedSchedule = createSelector(
  [Merged, (_, type: TKeyOrganizedScheduleData) => type],
  (
    { currentDateSchedule, updatedDateSchedule, date },
    type,
  ): { packageId: string | null; changed: boolean } => {
    if (
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

export const useDefaultMergedDateTime = createSelector(
  [Merged, (_, type: TKeyOrganizedScheduleData) => type],
  (
    { currentDateSchedule, updatedDateSchedule, date },
    type,
  ): { packageId: string | null; changed: boolean; time?: string } => {
    if (
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
