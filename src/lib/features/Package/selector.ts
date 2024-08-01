import { RootState } from "@/lib/store/adminStore";
import { TKeyOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { createSelector } from "@reduxjs/toolkit";


export const Packages = (state: RootState) => state.packages.OrganizedPackage;

export const useIsIdExclusive = createSelector(
  [Packages, (_, id:string | null)=> id],
  ({breakfast},  id): boolean => {
    if (!id) return false;

    const ExclusivePackage = breakfast.find(
      (item) => item.packageCategory === "EXCLUSIVE",
    );

    if (ExclusivePackage?.id !== id) {
      return false;
    }

    return true;
  }
);
