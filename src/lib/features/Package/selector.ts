import { TKeyOrganized } from "@/components/admin/dashboard/Schedule/ScheduleSelector";
import { RootState } from "@/lib/store/adminStore";
import { TKeyOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { createSelector } from "@reduxjs/toolkit";

export const Packages = (state: RootState) => state.packages.OrganizedPackage;

export const IsIdExclusive = createSelector(
  [
    Packages,
    (_, id: string | null) => id,
    (_, __, type: TKeyOrganized) => type,
  ],
  (packages, id, type): boolean => {
    if (!id) return false;
    const ExclusivePackage = packages[type].find(
      (item) =>
        item.packageCategory === "EXCLUSIVE" ||
        item.packageCategory === "CUSTOM",
    );

    if (ExclusivePackage?.id !== id) {
      return false;
    }

    return true;
  },
);

export const SelectPackageById = createSelector(
  [
    Packages,
    (__, id: string) => id,
    (_, __, type: TKeyOrganizedScheduleData) => type,
  ],
  (packages, id, type) => {
    const ExclusivePackage = packages[type].find((item) => item.id === id);
    if (!ExclusivePackage) return null;
    return ExclusivePackage;
  },
);
