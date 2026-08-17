/**
 * Row builders for the integration suite.
 *
 * `makeSchedule` deliberately goes through the production
 * `deriveScheduleInstants` rather than computing `startsAt`/`endsAt` itself.
 * Two reasons: a fixture that derived instants its own way would stop testing
 * the rule the app actually uses, and `Schedule_day_matches_startsAt` — the
 * CHECK constraint the whole UTC migration exists to enforce — would reject the
 * row anyway. Using the real rule means every fixture is a live assertion that
 * the rule and the constraint agree.
 */
import { db } from "@/db";
import { dayKeyToDateColumn, type IstDayKey } from "@/lib/datetime";
import { deriveScheduleInstants } from "@/lib/helpers/scheduleInstants";
import type { SCHEDULE_STATUS, SCHEDULED_TIME } from "@prisma/client";

export const key = (s: string) => s as IstDayKey;

export async function makeSchedule(args: {
  day: IstDayKey;
  packageId: string | null;
  packageStartMinutesIst?: number | null;
  packageDurationMinutes?: number | null;
  overrideStartMinutes?: number | null;
  overrideEndMinutes?: number | null;
  schedulePackage?: SCHEDULED_TIME;
  scheduleStatus?: SCHEDULE_STATUS;
}) {
  const instants = deriveScheduleInstants({
    day: args.day,
    packageStartMinutesIst: args.packageStartMinutesIst,
    packageDurationMinutes: args.packageDurationMinutes,
    overrideStartMinutes: args.overrideStartMinutes,
    overrideEndMinutes: args.overrideEndMinutes,
  });

  return db.schedule.create({
    data: {
      day: dayKeyToDateColumn(args.day),
      startsAt: instants.startsAt,
      endsAt: instants.endsAt,
      isTimeOverridden: instants.isTimeOverridden,
      packageId: args.packageId,
      schedulePackage: args.schedulePackage ?? "BREAKFAST",
      scheduleStatus: args.scheduleStatus ?? "AVAILABLE",
    },
  });
}

export async function makeUser(
  overrides: Partial<{ name: string; email: string; contact: string }> = {},
) {
  return db.user.create({
    data: {
      name: overrides.name ?? "Test Customer",
      email: overrides.email ?? "customer@test.invalid",
      contact: overrides.contact ?? "9876543210",
    },
  });
}

/**
 * A paid-for booking on a schedule. Used to fill seats when testing capacity —
 * the real booking path runs through the webhook, so this is only for arranging
 * a starting state, never for asserting the write path.
 */
export async function makeBooking(args: {
  scheduleId: string;
  numOfAdults?: number;
  numOfChildren?: number;
  numOfBaby?: number;
  userId?: string;
  totalAmount?: number;
}) {
  const userId = args.userId ?? (await makeUser()).id;
  return db.booking.create({
    data: {
      numOfAdults: args.numOfAdults ?? 1,
      numOfChildren: args.numOfChildren ?? 0,
      numOfBaby: args.numOfBaby ?? 0,
      description: "seeded by tests/helpers/factories",
      // Relation form throughout: Prisma refuses a create that mixes scalar
      // foreign keys (userId) with nested writes (payment.create).
      schedule: { connect: { id: args.scheduleId } },
      user: { connect: { id: userId } },
      payment: {
        create: {
          totalAmount: args.totalAmount ?? 1000,
          baseAmount: args.totalAmount ?? 1000,
          gstRate: 5,
          gstAmount: 0,
          advancePaid: 0,
          discount: 0,
          modeOfPayment: "ONLINE",
        },
      },
    },
  });
}

/** Fills `seats` places on a schedule with as few bookings as possible. */
export async function fillSeats(scheduleId: string, seats: number) {
  if (seats <= 0) return;
  await makeBooking({ scheduleId, numOfAdults: seats });
}
