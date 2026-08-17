/**
 * Refuses to let a test run touch anything but a `_test` database.
 *
 * `src/db` builds its PrismaClient with no explicit datasource, so the URL comes
 * from the environment — and importing `@prisma/client` also runs dotenv over
 * the real `.env`. The migration doc records that resolution order biting once
 * already: `DATABASE_URL=<other> prisma db push` silently ran against the
 * database named in `.env`. The vitest `env` block should win here, but "should"
 * is not a guarantee worth betting the dev database on, so this asks the server
 * what it actually connected to.
 *
 * Same idea as `--expect-db=<name>` in prisma/scripts/backfill-schedule-instants.ts.
 *
 * Registered as `beforeAll` rather than run at the top level: as a setup file it
 * applies to every integration test file, and tsconfig sets no `target`, which
 * puts top-level await out of reach of `pnpm type-check`.
 */
import { beforeAll } from "vitest";
import { db } from "@/db";

beforeAll(async () => {
  const rows = await db.$queryRaw<{ current_database: string }[]>`
    SELECT current_database()
  `;
  const name = rows[0]?.current_database;

  if (!name || !name.endsWith("_test")) {
    throw new Error(
      `Refusing to run: connected to database "${name}", which is not a *_test ` +
        `database. Integration tests truncate every table. Check DATABASE_URL in ` +
        `vitest.config.mts and run \`make test-db-setup\`.`,
    );
  }
});
