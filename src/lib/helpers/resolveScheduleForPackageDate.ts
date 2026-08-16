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
 * admin-generated booking links cannot drift apart on these rules. The error
 * messages are surfaced to customers.
 *
 * Invariant: the returned schedule is always on `selectedScheduleDate`. See the
 * lookup below for why that has to be enforced here rather than trusted from the
 * client.
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
  // The resolved schedule is the authority on when this sailing departs —
  // booking-link generation snapshots these rather than re-deriving from the
  // package, so an override set by an admin is respected.
  startsAt: true,
  endsAt: true,
  isTimeOverridden: true,
  needsTimeReview: true,
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
  allowHidden = false,
}: {
  packageId: string;
  /**
   * Optional, advisory only. Never affects which schedule is returned — the
   * resolution is driven entirely by `selectedScheduleDate`. Kept so a drifting
   * client can be spotted in the logs.
   */
  scheduleId?: string;
  selectedScheduleDate: string | Date;
  /**
   * Set only by the booking-link flows. A link issued before the package was
   * hidden has to keep resolving; the public booking form must not.
   */
  allowHidden?: boolean;
}): Promise<TResolveScheduleResult> {
  // Check the package exists and is one the public may book at all.
  const packageIdExists = await findPackageByIdExcludingCustomAndExclusive(
    packageId,
    { allowHidden },
  );

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
   * The selected date decides which schedule a booking attaches to — never the
   * client-supplied id.
   *
   * This used to be `OR: [{ id: scheduleId }, { day, slot }]`, which let a stale
   * but still-valid id match its own row and win, silently attaching the booking
   * to a different day. The calendar can produce such an id (it changes the date
   * without clearing the id when its month query has no data), so customers were
   * being booked days away from what they picked.
   *
   * `day` is now the only unconditional term, so whatever comes back is
   * guaranteed to be on the requested date. The inner OR widens the match within
   * that day: normally the slot identifies the schedule, but an admin may create
   * a schedule whose `schedulePackage` differs from its package's category slot
   * (the admin form takes the two independently), and the public calendar shows
   * those as bookable because it filters by `packageId` alone. Matching on
   * either keeps those bookable while still surfacing a slot held by a different
   * package as the CONFLICT below.
   *
   * `orderBy` is required: nothing at the DB level prevents two rows sharing a
   * (day, slot) — `handleCreateScheduleOrder` creates without a uniqueness check
   * — and an unordered `findFirst` would pick between duplicates arbitrarily.
   */
  const schedule = await db.schedule.findFirst({
    select: scheduleSelect,
    where: {
      day: new Date(selectedScheduleDate),
      OR: [
        { schedulePackage: scheduleTime },
        { packageId: packageIdExists.id },
      ],
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });

  /**
   * The id is now only a hint about what the customer's calendar believed. A
   * mismatch is not fatal — the date already gave us the right row, and schedules
   * are legitimately deleted and recreated by admins while a form sits open, so
   * rejecting here would fail real bookings. Log it instead: a rising count means
   * a client is drifting again.
   */
  if (scheduleId && scheduleId !== schedule?.id) {
    console.warn(
      `[resolveSchedule] ignoring stale scheduleId hint ${scheduleId} for ${selectedScheduleDate}/${scheduleTime}; resolved ${schedule?.id ?? "none"}`,
    );
  }

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
