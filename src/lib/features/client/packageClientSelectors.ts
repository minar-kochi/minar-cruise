import { ClientRootState } from "@/lib/store/clientStore";
import { isStatusSunset } from "@/lib/validators/Schedules";
import { createSelector } from "@reduxjs/toolkit";

export const SelectedPackages = (state: ClientRootState) =>
  state.package.selectedPackages;

export const packages = (state: ClientRootState) => state.package.packages;

export const isSelectedPackage = createSelector(
  [SelectedPackages, (_, id: string) => id],
  (selected, id) => {
    let indexFoundAt = selected.findIndex((fv) => fv.id === id);

    if (indexFoundAt === -1) {
      return {
        selected: false,
        index: -1,
      };
    }
    return {
      selected: true,
      index: indexFoundAt,
    };
  },
);

export const getPackageById = createSelector(
  [packages, (_, id: string) => id],
  (packages, id) => {
    let data = (packages && packages.find((fv) => fv.id === id)) ?? null;
    return data;
  },
);

export const getSunsetPackage = createSelector([packages], (packages) => {
  let sunset = packages?.find((item) => isStatusSunset(item.packageCategory));
  return sunset;
});
