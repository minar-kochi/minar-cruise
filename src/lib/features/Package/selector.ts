import { RootState } from "@/lib/store/adminStore";
import { TKeyOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { createSelector } from "@reduxjs/toolkit";

export const Packages = (state: RootState) => state.package;

export const useIsIdExclusive = createSelector(
  [
    Packages,
    (Packages, id: string | null, type: TKeyOrganizedScheduleData) => ({
      id,
      type,
    }),
  ],
  ({ OrganizedPackage }, { id, type }): boolean => {
    if (!id) return false;

    const ExclusivePackage = OrganizedPackage[type].find(
      (item) => item.packageCategory === "EXCLUSIVE"
    );

    if (ExclusivePackage?.id !== id) {
      return false;
    }

    return true;
  }
);
