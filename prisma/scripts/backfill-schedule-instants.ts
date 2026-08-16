/**
 * Backfills the UTC instants that replace the split (day + "09:00:AM") model.
 *
 *   docker exec --user node -w /workspace/minar-cruise minar-dev \
 *     npx tsx prisma/scripts/backfill-schedule-instants.ts [--apply]
 *
 * Runs as a DRY RUN by default and prints exactly what it would change. Pass
 * --apply to write.
 *
 * WHY THIS IS TYPESCRIPT AND NOT SQL
 * ----------------------------------
 * It imports `parseLegacyMeridiemTime` and `istInstant` from src/lib/datetime.ts,
 * so the only implementation of "parse a legacy time" and "IST wall clock -> UTC
 * instant" is the one the application itself uses. A SQL mirror would be a
 * second implementation that could drift from the first, and would need a
 * parity check to prove it had not. There is nothing to prove if there is only
 * one.
 *
 * It also means no user-defined function is ever created in the database.
 *
 * THE THREE CLASSES OF SCHEDULE
 * -----------------------------
 *   AVAILABLE  packageId set, fromTime null   -> inherit the package's times
 *   EXCLUSIVE  fromTime/toTime set explicitly -> use the override
 *   BLOCKED    packageId AND fromTime null    -> no sailing; instants stay NULL
 *
 * Production at 2026-08-16: 495 / 23 / 229, and zero bookings on BLOCKED rows,
 * which is what makes the nullable instants safe.
 *
 * Idempotent: recomputes from the legacy columns every run, so a partial or
 * interrupted run is simply resumed. Reverse with
 *   UPDATE "Schedule" SET "startsAt"=NULL,"endsAt"=NULL,"needsTimeReview"=false;
 */
import { PrismaClient } from "@prisma/client";
import {
  dayKeyOfDateColumn,
  formatIstMinutes,
  formatIstTime,
  istDayKeyOf,
  istInstant,
  parseLegacyMeridiemTime,
} from "../../src/lib/datetime";
import {
  deriveScheduleInstants,
  type ScheduleInstants,
} from "../../src/lib/helpers/scheduleInstants";

const db = new PrismaClient();

const APPLY = process.argv.includes("--apply");

type Resolution = ScheduleInstants & {
  id: string;
  dayKey: string;
  klass: "inherited" | "override" | "timeless";
  crossesMidnight: boolean;
  note?: string;
};

async function main() {
  console.log(
    `\n${APPLY ? "APPLYING" : "DRY RUN"} — schedule instant backfill\n${"=".repeat(52)}`,
  );

  // Prisma Client auto-loads .env, which can silently win over an exported
  // DATABASE_URL. For a script that writes, "which database am I actually
  // connected to" must never be a guess — so ask the server, not the config.
  const [{ db: dbName, host }] = await db.$queryRaw<
    { db: string; host: string | null }[]
  >`SELECT current_database() AS db, inet_server_addr()::text AS host`;
  console.log(`  target: ${dbName} @ ${host ?? "local socket"}`);

  const expected = process.argv
    .find((a) => a.startsWith("--expect-db="))
    ?.split("=")[1];
  if (expected && expected !== dbName) {
    throw new Error(
      `Refusing to run: connected to "${dbName}" but --expect-db=${expected}.`,
    );
  }
  if (APPLY && !expected) {
    throw new Error(
      `--apply requires --expect-db=<name> naming the database you mean to ` +
        `write to. This script rewrites every Schedule row.`,
    );
  }

  // -------------------------------------------------------------- Package
  const packages = await db.package.findMany({
    select: { id: true, title: true, fromTime: true, toTime: true, duration: true },
  });

  const pkgStart = new Map<string, number>();
  let pkgFailures = 0;

  for (const p of packages) {
    const from = parseLegacyMeridiemTime(p.fromTime);
    const to = parseLegacyMeridiemTime(p.toTime);
    if (from === null || to === null) {
      console.error(
        `  FAIL  package ${p.title}: unparseable times ${p.fromTime} / ${p.toTime}`,
      );
      pkgFailures++;
      continue;
    }
    // The end time is about to become `startMinutesIst + duration`, so the two
    // representations must already agree or we would be silently changing when
    // cruises return. Verified exact for all 9 production packages.
    const derived = ((to - from) + 1440) % 1440;
    if (derived !== p.duration) {
      console.error(
        `  FAIL  package ${p.title}: duration ${p.duration} <> ${derived} implied by ${p.fromTime}-${p.toTime}`,
      );
      pkgFailures++;
      continue;
    }
    pkgStart.set(p.id, from);
  }

  if (pkgFailures > 0) {
    throw new Error(
      `${pkgFailures} package(s) failed validation — refusing to backfill. ` +
        `Fix the data or the assumption before continuing.`,
    );
  }
  console.log(`\nPackages: ${packages.length} validated, all durations consistent.`);

  // ------------------------------------------------------------- Schedule
  const schedules = await db.schedule.findMany({
    select: {
      id: true,
      day: true,
      fromTime: true,
      toTime: true,
      packageId: true,
      scheduleStatus: true,
    },
    orderBy: { day: "asc" },
  });

  const resolutions: Resolution[] = [];

  for (const s of schedules) {
    const dayKey = dayKeyOfDateColumn(s.day);
    if (!dayKey) throw new Error(`Schedule ${s.id} has an invalid day column`);

    const pkg = s.packageId
      ? packages.find((p) => p.id === s.packageId) ?? null
      : null;

    // Exactly the rule the application uses at write time — same function, so
    // migrated rows and rows created after the migration cannot disagree.
    const instants = deriveScheduleInstants({
      day: s.day,
      packageStartMinutesIst: s.packageId ? pkgStart.get(s.packageId) ?? null : null,
      packageDurationMinutes: pkg?.duration ?? null,
      overrideFrom: s.fromTime,
      overrideTo: s.toTime,
    });

    const hasOverride = parseLegacyMeridiemTime(s.fromTime) !== null;
    const klass: Resolution["klass"] =
      instants.startsAt === null ? "timeless" : hasOverride ? "override" : "inherited";

    // A sailing whose return lands on a later IST day than its departure.
    const crossesMidnight =
      instants.startsAt !== null &&
      instants.endsAt !== null &&
      istDayKeyOf(instants.startsAt) !== istDayKeyOf(instants.endsAt);

    let note: string | undefined;
    if (instants.needsTimeReview) {
      const startMin = parseLegacyMeridiemTime(s.fromTime) ?? pkgStart.get(s.packageId ?? "") ?? 0;
      const rawEnd = parseLegacyMeridiemTime(s.toTime);
      note =
        rawEnd === null
          ? "no end time derivable"
          : `implausible: ${formatIstMinutes(startMin)} -> ${formatIstMinutes(rawEnd)} would be ${(((rawEnd + 1440 - startMin) % 1440) / 60).toFixed(1)}h`;
    }

    resolutions.push({ ...instants, id: s.id, dayKey, klass, crossesMidnight, note });
  }

  const timeless = resolutions.filter((r) => r.klass === "timeless");
  const overrides = resolutions.filter((r) => r.klass === "override");
  const inherited = resolutions.filter((r) => r.klass === "inherited");
  const flagged = resolutions.filter((r) => r.needsTimeReview);
  const crossing = resolutions.filter((r) => r.crossesMidnight);

  console.log(`\nSchedules: ${schedules.length}`);
  console.log(`  inherited from package : ${inherited.length}`);
  console.log(`  explicit override      : ${overrides.length}`);
  console.log(`  timeless (BLOCKED)     : ${timeless.length}  -> instants stay NULL`);
  console.log(`  crossing midnight      : ${crossing.length}`);
  console.log(`  FLAGGED for review     : ${flagged.length}`);

  if (crossing.length) {
    console.log(`\n  Midnight crossings (endsAt rolls to the next IST day):`);
    for (const r of crossing) {
      console.log(
        `    ${r.dayKey}  ${formatIstTime(r.startsAt)} -> ${formatIstTime(r.endsAt)} (+1)`,
      );
    }
  }

  if (flagged.length) {
    console.log(`\n  Flagged — NOT given an end time, needs a human:`);
    for (const r of flagged) {
      console.log(`    ${r.dayKey}  ${r.id}  ${r.note}`);
    }
  }

  // Guard against a booked sailing losing its departure.
  const timelessIds = new Set(timeless.map((r) => r.id));
  const bookedTimeless = await db.booking.count({
    where: { scheduleId: { in: Array.from(timelessIds) } },
  });
  if (bookedTimeless > 0) {
    throw new Error(
      `${bookedTimeless} booking(s) point at a schedule with no derivable ` +
        `departure. Refusing to backfill — startsAt cannot be NULL for a ` +
        `schedule someone has paid for.`,
    );
  }
  console.log(`\n  Bookings on timeless schedules: 0 (safe)`);

  if (!APPLY) {
    console.log(`\nDry run complete. Re-run with --apply to write.\n`);
    return;
  }

  // ------------------------------------------------------------------ write
  await db.$transaction(async (tx) => {
    for (const [id, startMin] of Array.from(pkgStart)) {
      await tx.package.update({
        where: { id },
        data: { startMinutesIst: startMin },
      });
    }

    for (const r of resolutions) {
      await tx.schedule.update({
        where: { id: r.id },
        data: {
          startsAt: r.startsAt,
          endsAt: r.endsAt,
          isTimeOverridden: r.isTimeOverridden,
          needsTimeReview: r.needsTimeReview,
        },
      });
    }
  });

  console.log(`\n  Wrote ${pkgStart.size} packages, ${resolutions.length} schedules.`);

  // --------------------------------------------------- BookingLink snapshot
  // Absent in production; present in dev/staging with test links worth keeping.
  const links = await db.bookingLink.findMany({
    select: { id: true, scheduleDay: true, packageId: true },
  });
  let linkUpdates = 0;
  for (const l of links) {
    const dayKey = dayKeyOfDateColumn(l.scheduleDay);
    const start = pkgStart.get(l.packageId);
    const pkg = packages.find((p) => p.id === l.packageId);
    if (!dayKey || start === undefined || !pkg) continue;
    await db.bookingLink.update({
      where: { id: l.id },
      data: {
        scheduleStartsAt: istInstant(dayKey as never, start),
        scheduleEndsAt: istInstant(dayKey as never, start + pkg.duration),
      },
    });
    linkUpdates++;
  }
  if (links.length) {
    console.log(`  Wrote ${linkUpdates}/${links.length} booking-link snapshots.`);
  }

  console.log(
    `\nDone. Now run prisma/sql/2026-08-tz/002_verify.sql — every count must be 0.\n`,
  );
}

main()
  .catch((e) => {
    console.error(`\n${e instanceof Error ? e.message : e}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
