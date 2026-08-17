/**
 * Guards on the test harness itself, not on the app.
 *
 * The database check is the one that matters: `src/db` builds its PrismaClient
 * with no explicit datasource, and importing `@prisma/client` runs dotenv over
 * the real `.env`. tests/setup/db-guard.ts already refuses to start against
 * anything but a `*_test` database; this pins the exact name, so a future change
 * to how DATABASE_URL is resolved fails here rather than quietly truncating
 * `myapp`.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import { resetDb, type Baseline } from "../helpers/db";

let base: Baseline;

beforeEach(async () => {
  base = await resetDb();
});

describe("harness", () => {
  it("is pointed at minar_test, never the dev database", async () => {
    const rows = await db.$queryRaw<
      { current_database: string }[]
    >`SELECT current_database()`;
    expect(rows[0].current_database).toBe("minar_test");
  });

  it("has the CHECK constraints that db push alone would not create", async () => {
    const rows = await db.$queryRaw<{ conname: string }[]>`
      SELECT con.conname
      FROM pg_constraint con
      JOIN pg_class c ON c.oid = con.conrelid
      WHERE con.contype = 'c'
        AND c.relname IN ('Package', 'Schedule', 'BookingLink')
    `;
    const names = rows.map((r) => r.conname);

    // The invariant the whole UTC-instants migration exists to enforce.
    expect(names).toContain("Schedule_day_matches_startsAt");
    expect(names).toContain("Schedule_instants_ordered");
    expect(names).toContain("Schedule_instants_present");
    expect(names).toContain("Package_startMinutesIst_range");
    expect(names).toContain("Package_duration_range");
    expect(names).toContain("BookingLink_schedule_ordered");
  });

  it("truncates and re-seeds between tests", async () => {
    expect(await db.package.count()).toBe(1);
    expect(await db.booking.count()).toBe(0);
    expect(base.pkg.startMinutesIst).toBe(540);
    // gstRate is a PERCENTAGE — 5, not 0.05.
    expect(base.taxConfig.gstRate).toBe(5);
  });
});
