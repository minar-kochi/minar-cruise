import { istMinutesOfInstant } from "@/lib/datetime";
import { RootState } from "@/lib/store/adminStore";
import { TKeyOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import { createSelector } from "@reduxjs/toolkit";
import { Packages } from "../Package/selector";
import { TKeyOrganized } from "@/components/admin/dashboard/Schedule/ScheduleSelector";
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
 * The single answer to "what should the time inputs show, and has it changed?"
 *
 * There used to be three selectors here — `currentScheduleTimer`,
 * `DefaultMergedScheduleTimer` and `UpdatedSchedule` — disagreeing about which
 * slice of state was authoritative. The one wired to the inputs read
 * `currentDateSchedule`, i.e. the saved DB row, so the controlled input
 * re-rendered the stored value on every keystroke and could never change.
 *
 * `startMinutes`/`endMinutes` are what the input renders, resolved by
 * precedence: the admin's draft, then the saved schedule's instants, then the
 * selected package's default.
 *
 * `dbStartMinutes`/`dbEndMinutes` are what is actually saved, kept separate on
 * purpose. The dirty check must compare the draft against the DB, not against
 * what is rendered — otherwise prefilling a brand-new schedule from its package
 * would immediately read as "changed".
 */
export type TScheduleTimer = {
  startMinutes: number | null;
  endMinutes: number | null;
  dbStartMinutes: number | null;
  dbEndMinutes: number | null;
  source: "draft" | "schedule" | "package" | "none";
};

export const scheduleTimeDraft = createSelector(
  [
    Schedule,
    Packages,
    (_: RootState, type: TKeyOrganizedScheduleData) => type,
  ],
  ({ currentDateSchedule, updatedDateSchedule }, packages, type): TScheduleTimer => {
    const saved = currentDateSchedule[type];
    const draft = updatedDateSchedule[type];

    const dbStartMinutes = saved?.startsAt
      ? istMinutesOfInstant(saved.startsAt)
      : null;
    const dbEndMinutes = saved?.endsAt
      ? istMinutesOfInstant(saved.endsAt)
      : null;

    // The package the admin currently has selected, which may differ from the
    // one on the saved row.
    const selectedPackageId = draft?.packageId ?? saved?.packageId ?? null;
    const pkg = selectedPackageId
      ? [
          ...packages.breakfast,
          ...packages.lunch,
          ...packages.sunset,
          ...packages.dinner,
          ...packages.custom,
        ].find((p) => p.id === selectedPackageId) ?? null
      : null;

    const pkgStart = pkg?.startMinutesIst ?? null;
    const pkgEnd =
      pkgStart != null && pkg?.duration != null ? pkgStart + pkg.duration : null;

    // `!== undefined` rather than a truthiness test: 0 is midnight, and null is
    // the admin deliberately clearing the field. Both must beat the fallbacks.
    if (draft?.startMinutes !== undefined || draft?.endMinutes !== undefined) {
      return {
        startMinutes: draft.startMinutes ?? null,
        endMinutes: draft.endMinutes ?? null,
        dbStartMinutes,
        dbEndMinutes,
        source: "draft",
      };
    }

    if (dbStartMinutes !== null) {
      return {
        startMinutes: dbStartMinutes,
        endMinutes: dbEndMinutes,
        dbStartMinutes,
        dbEndMinutes,
        source: "schedule",
      };
    }

    if (pkgStart !== null) {
      return {
        startMinutes: pkgStart,
        endMinutes: pkgEnd,
        dbStartMinutes,
        dbEndMinutes,
        source: "package",
      };
    }

    return {
      startMinutes: null,
      endMinutes: null,
      dbStartMinutes,
      dbEndMinutes,
      source: "none",
    };
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
  [
    Schedule,
    scheduleTimeDraft,
    (_: RootState, type: TKeyOrganized) => type,
  ],
  (
    { currentDateSchedule, updatedDateSchedule },
    timer,
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
      updatedDateSchedule[type]?.packageId !== undefined &&
      currentDateSchedule[type]?.packageId !==
        updatedDateSchedule[type]?.packageId
    ) {
      Changed.packageId = true;
    }

    // Dirty-check the times by comparing the admin's draft against what is
    // saved. This used to read `updatedDateSchedule[type].startsAt` — a field
    // nothing in the app ever wrote — so for any schedule with a departure it
    // compared a real instant against undefined, reported "changed" forever,
    // and left the Update button permanently enabled.
    //
    // Only a real draft counts. A value merely prefilled from the schedule or
    // its package is not an edit.
    if (
      timer.source === "draft" &&
      (timer.startMinutes !== timer.dbStartMinutes ||
        timer.endMinutes !== timer.dbEndMinutes)
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
