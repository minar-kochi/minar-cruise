import "server-only";
import { db } from "@/db";
import {
  findPackageByIdExcludingCustomAndExclusive,
  TFindPackageByIdExcludingCustomAndExclusive,
} from "@/db/data/dto/package";
import { findCorrespondingScheduleTimeFromPackageCategory } from "@/lib/Data/manipulators/ScheduleManipulators";
import { decideCreateOrExisting } from "@/lib/helpers/RequestToCreateSchedule";
import { ScheduleConflictError } from "@/Types/Schedule/ScheduleConflictError";
import { $Enums, Schedule } from "@prisma/client";
import { TRPCError } from "@trpc/server";

/**
 * Decide, for a (package, date) pair, whether a booking should attach to an
 * existing Schedule or create one on payment — and reject the combinations that
 * must never reach Razorpay (unknown/non-public package, blocked or exclusive
 * slot, a slot already taken by a different package).
 *
 * Extracted from `user.createRazorPayIntent` so the public booking flow and
 * admin-generated booking links cannot drift apart on these rules. Behaviour is
 * unchanged from the original inline version, including the error messages,
 * which are surfaced to customers.
 */

const scheduleSelect = {
  id: true,
  schedulePackage: true,
  packageId: true,
  day: true,
  fromTime: true,
  scheduleStatus: true,
  createdAt: true,
  updatedAt: true,
  toTime: true,
  Package: {
    select: {
      title: true,
      slug: true,
    },
  },
} as const;

export type TResolvedSchedule = Schedule & {
  Package: { title: string; slug: string } | null;
};

export type TResolveScheduleResult =
  | {
      decider: "schedule.create";
      packageIdExists: TFindPackageByIdExcludingCustomAndExclusive;
      scheduleTime: $Enums.SCHEDULED_TIME;
      schedule: null;
    }
  | {
      decider: "schedule.existing";
      packageIdExists: TFindPackageByIdExcludingCustomAndExclusive;
      scheduleTime: $Enums.SCHEDULED_TIME;
      schedule: TResolvedSchedule;
    };

export async function resolveScheduleForPackageDate({
  packageId,
  scheduleId,
  selectedScheduleDate,
}: {
  packageId: string;
  /** Optional hint. A stale or bogus id simply falls through to the date match. */
  scheduleId?: string;
  selectedScheduleDate: string | Date;
}): Promise<TResolveScheduleResult> {
  // Check the package exists and is one the public may book at all.
  const packageIdExists =
    await findPackageByIdExcludingCustomAndExclusive(packageId);

  if (!packageIdExists) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Could not find given package",
    });
  }

  // Map the package to its schedule slot.
  const scheduleTime = findCorrespondingScheduleTimeFromPackageCategory(
    packageIdExists.packageCategory,
  );

  if (!scheduleTime) {
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: "Couldn't find any package that are available to public",
    });
  }

  /**
   * Match on the id hint OR on (day, slot). A random/stale id yields no row, so
   * the flow falls through to the create-schedule branch.
   */
  const schedule = await db.schedule.findFirst({
    select: scheduleSelect,
    where: {
      OR: [
        { id: scheduleId },
        {
          day: new Date(selectedScheduleDate),
          schedulePackage: scheduleTime,
        },
      ],
    },
  });

  if (
    schedule?.scheduleStatus === "BLOCKED" ||
    schedule?.scheduleStatus === "EXCLUSIVE"
  ) {
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message:
        "Schedule for selected date is blocked, Please try different date.",
    });
  }

  const decider = decideCreateOrExisting(schedule?.id);

  if (decider === "schedule.create") {
    return { decider, packageIdExists, scheduleTime, schedule: null };
  }

  if (!schedule || !schedule.id) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message:
        "Sorry, We didn't find the schedule appropriate to what you are looking for..",
    });
  }

  // The slot exists but belongs to a different package — surface which one, so
  // the client can point the customer at the right package page.
  if (schedule.packageId !== packageIdExists.id) {
    const conflict: ScheduleConflictError = {
      title: schedule.Package?.title ?? "",
      slug: schedule.Package?.slug ?? "",
      subCode: "SCHEDULE_CONFLICT_WITH_PACKAGE",
      message: `There is Another Schedule at this Date and Time, Please Check ${schedule.Package?.title} to book for this date`,
    };
    throw new TRPCError({
      code: "CONFLICT",
      message: JSON.stringify(conflict),
    });
  }

  return { decider, packageIdExists, scheduleTime, schedule };
}
