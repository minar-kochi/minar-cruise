import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { createId } from "@paralleldrive/cuid2";
import { PrismaClient } from "@prisma/client";

/**
 * Migrates an EXISTING database onto the admin-controlled package schema.
 *
 * `prisma/seed.ts` only ever runs against an empty local database, so it cannot
 * help production. This script covers the three things `prisma db push` does
 * not do on its own:
 *
 *   1. `Amenities.description` (String[]) -> `AmenityItem` rows. The push DROPS
 *      that column, so the values have to be read out BEFORE it runs.
 *   2. The per-package booking rules. The new columns arrive as NULL/true,
 *      which means "inherit the site default" — so without this, breakfast
 *      loses its 16-hour cutoff, sunset gains a 30-guest floor, and the
 *      exclusive/custom packages start rendering a live booking form.
 *   3. Splitting the `Amenities` row that Custom and Exclusive share. Harmless
 *      while amenities were a static array, but they are individually editable
 *      rows now, so sharing means editing either rewrites both.
 *
 * Deliberately has no `localhost` guard — unlike `seed.ts`, this is meant to be
 * pointed at production.
 *
 * Usage, in this order:
 *
 *   pnpm backfill-package-config dump      # BEFORE `prisma db push`
 *   pnpm exec prisma db push
 *   pnpm backfill-package-config apply     # dry run, prints the plan
 *   pnpm backfill-package-config apply --commit
 *
 * `apply` is idempotent: every write is guarded on the value still being at its
 * post-push default, so a second run is a no-op and an admin's later edits are
 * never stomped.
 */

const db = new PrismaClient();

const DUMP_PATH = join(__dirname, ".amenities-dump.json");

/**
 * Fixed rather than generated so a migrated database ends up with the same id
 * as a freshly seeded one. Must match `prisma/data/dbAmenities.ts`.
 */
const CUSTOM_AMENITIES_ID = "clv2m8p4r0000847twe52k739";

/**
 * The overrides that used to be per-category constants in
 * `src/constants/config/business.ts`. Must match `prisma/data/dbPackage.ts`.
 *
 * `undefined` means "leave this column alone".
 */
const RULES_BY_CATEGORY: Record<
  string,
  {
    minLeadTimeHours?: number;
    minNewBookingCount?: number;
    isBookableOnline?: boolean;
  }
> = {
  // Was MIN_BREAKFAST_BOOKING_HOUR — the galley preps the evening before.
  BREAKFAST: { minLeadTimeHours: 16 },
  // Was MIN_SUNSET_BOOKING_HOUR, plus the `!isStatusSunset` exemption from the
  // 30-guest floor. 0 is the sentinel for "no minimum", distinct from null.
  SUNSET: { minLeadTimeHours: 1, minNewBookingCount: 0 },
  // Was `isPackageStatusExclusive` on the package page. These cannot be paid
  // for anyway — `findPackageByIdExcludingCustomAndExclusive` rejects them — so
  // leaving the form on produces a dead-end enquiry funnel.
  EXCLUSIVE: { isBookableOnline: false },
  CUSTOM: { isBookableOnline: false },
};

type AmenitiesDump = { id: string; description: string[] }[];

/* -------------------------------------------------------------------------- */
/* Phase 1 — before `prisma db push`                                          */
/* -------------------------------------------------------------------------- */

async function dump() {
  // Raw SQL on purpose: the generated client no longer knows about
  // `description`, but the column is still there until the push runs.
  let rows: AmenitiesDump;
  try {
    rows = await db.$queryRaw<AmenitiesDump>`
      SELECT id, description FROM "Amenities" ORDER BY id
    `;
  } catch (error) {
    console.error(
      'Could not read "Amenities"."description".\n' +
        "If `prisma db push` has already run, that column is gone and this dump\n" +
        "cannot be recreated — restore a pre-push backup and start again.",
    );
    throw error;
  }

  if (!rows.length) {
    throw new Error(
      'No "Amenities" rows found. Refusing to write an empty dump, which would ' +
        "make the apply phase look like a successful no-op.",
    );
  }

  const bulletCount = rows.reduce(
    (sum, row) => sum + row.description.length,
    0,
  );
  writeFileSync(DUMP_PATH, JSON.stringify(rows, null, 2));
  console.log(
    `Wrote ${rows.length} amenities rows (${bulletCount} bullets) to ${DUMP_PATH}`,
  );
  console.log("Now run `prisma db push`, then this script's `apply` step.");
}

/* -------------------------------------------------------------------------- */
/* Phase 2 — after `prisma db push`                                           */
/* -------------------------------------------------------------------------- */

async function apply(commit: boolean) {
  if (!existsSync(DUMP_PATH)) {
    throw new Error(
      `No dump at ${DUMP_PATH}. Run the \`dump\` step BEFORE \`prisma db push\` — ` +
        "the amenity bullets cannot be recovered afterwards.",
    );
  }
  const dumped: AmenitiesDump = JSON.parse(readFileSync(DUMP_PATH, "utf8"));

  const plan: string[] = [];

  await db.$transaction(async (tx) => {
    /* 1. Amenity bullets ---------------------------------------------------- */

    // Only rows that have no items yet, so a re-run cannot duplicate bullets
    // and cannot resurrect ones an admin has since deleted.
    const existing = await tx.amenities.findMany({
      select: { id: true, _count: { select: { items: true } } },
    });
    const emptyAmenityIds = new Set(
      existing.filter((row) => row._count.items === 0).map((row) => row.id),
    );

    const itemsToCreate = dumped
      .filter((row) => emptyAmenityIds.has(row.id))
      .flatMap((row) =>
        row.description.map((label, order) => ({
          amenitiesId: row.id,
          label,
          order,
          isVisible: true,
        })),
      );

    const skipped = dumped.filter((row) => !emptyAmenityIds.has(row.id)).length;

    plan.push(
      `AmenityItem: create ${itemsToCreate.length} rows across ` +
        `${dumped.length - skipped} amenities (${skipped} already populated, skipped)`,
    );

    const missing = dumped.filter(
      (row) => !existing.some((e) => e.id === row.id),
    );
    if (missing.length) {
      plan.push(
        `  WARNING: ${missing.length} dumped amenities no longer exist: ` +
          missing.map((m) => m.id).join(", "),
      );
    }

    if (commit && itemsToCreate.length) {
      await tx.amenityItem.createMany({ data: itemsToCreate });
    }

    /* 2. Per-package booking rules ------------------------------------------ */

    for (const [category, rule] of Object.entries(RULES_BY_CATEGORY)) {
      for (const [column, value] of Object.entries(rule)) {
        // Guard on the post-push default, so a package an admin has already
        // configured is left exactly as they set it.
        const stillDefault =
          column === "isBookableOnline" ? { equals: true } : { equals: null };

        const where = {
          packageCategory: category as never,
          [column]: stillDefault,
        };

        const targets = await tx.package.findMany({
          where,
          select: { title: true },
        });

        if (!targets.length) {
          plan.push(`${category}.${column}: already set, skipped`);
          continue;
        }

        plan.push(
          `${category}.${column} = ${value} on ${targets.length} package(s): ` +
            targets.map((t) => t.title).join(", "),
        );

        if (commit) {
          await tx.package.updateMany({ where, data: { [column]: value } });
        }
      }
    }

    /* 3. Split shared Amenities rows ---------------------------------------- */

    const packages = await tx.package.findMany({
      select: {
        id: true,
        title: true,
        packageCategory: true,
        amenitiesId: true,
      },
      orderBy: { id: "asc" },
    });

    // A plain object rather than a Map: this tsconfig targets below ES2015, so
    // iterating a Map needs downlevelIteration. Same reason the amenities
    // router uses an indexed loop instead of `.entries()`.
    const byAmenitiesId: Record<string, typeof packages> = {};
    for (const pkg of packages) {
      (byAmenitiesId[pkg.amenitiesId] ||= []).push(pkg);
    }

    let splits = 0;
    for (const [amenitiesId, group] of Object.entries(byAmenitiesId)) {
      if (group.length < 2) continue;

      /**
       * The first package keeps the original row; every other one gets a clone.
       *
       * CUSTOM is forced to the back so it is never the keeper. That mirrors
       * `prisma/data/dbPackage.ts`, where Exclusive keeps the original
       * amenities id and Custom points at CUSTOM_AMENITIES_ID — without this,
       * plain id ordering puts "Custom Packages" first and a migrated database
       * ends up as the mirror image of a seeded one.
       */
      const ordered = [...group].sort(
        (a, b) =>
          Number(a.packageCategory === "CUSTOM") -
          Number(b.packageCategory === "CUSTOM"),
      );
      const [, ...needsOwn] = ordered;

      /**
       * Live rows when they exist — an admin may have edited the list between
       * the push and this run, and the clone should carry their text, not the
       * dump's. Falls back to the dump so a DRY RUN, where step 1 has written
       * nothing yet, still reports the real bullet count instead of 0.
       */
      const live = await tx.amenityItem.findMany({
        where: { amenitiesId },
        orderBy: { order: "asc" },
        select: { label: true, order: true, isVisible: true },
      });
      const source = live.length
        ? live
        : (dumped.find((row) => row.id === amenitiesId)?.description ?? []).map(
            (label, order) => ({ label, order, isVisible: true }),
          );

      for (const pkg of needsOwn) {
        // Fixed id for the known Custom/Exclusive pair so migrated and freshly
        // seeded databases agree; generated for anything else.
        const newId =
          pkg.packageCategory === "CUSTOM" ? CUSTOM_AMENITIES_ID : createId();

        if (await tx.amenities.findUnique({ where: { id: newId } })) {
          plan.push(`Amenities ${newId} already exists, skipping split`);
          continue;
        }

        splits++;
        plan.push(
          `Split: "${pkg.title}" gets its own Amenities ${newId} ` +
            `(${source.length} bullets cloned from ${amenitiesId})`,
        );

        if (commit) {
          await tx.amenities.create({
            data: { id: newId, items: { create: source } },
          });
          await tx.package.update({
            where: { id: pkg.id },
            data: { amenitiesId: newId },
          });
        }
      }
    }
    if (!splits) plan.push("Amenities: nothing shared, no splits needed");
  });

  console.log(plan.join("\n"));
  console.log(
    commit
      ? "\nCommitted."
      : "\nDRY RUN — nothing was written. Re-run with --commit to apply.",
  );
}

/* -------------------------------------------------------------------------- */

async function main() {
  const [step, ...flags] = process.argv.slice(2);
  await db.$connect();

  if (step === "dump") {
    await dump();
  } else if (step === "apply") {
    await apply(flags.includes("--commit"));
  } else {
    throw new Error(
      "Usage: backfillPackageConfig.ts dump | apply [--commit]\n" +
        "  dump   run BEFORE `prisma db push`\n" +
        "  apply  run AFTER; omit --commit for a dry run",
    );
  }

  await db.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await db.$disconnect();
  process.exit(1);
});
