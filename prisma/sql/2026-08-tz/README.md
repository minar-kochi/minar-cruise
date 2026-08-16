# 2026-08 — UTC instant consolidation

Migrates cruise timings from a split `(date column + "09:00:AM" string)`
representation to real UTC instants on `Schedule`, with IST applied only at the
display boundary.

## Why these are plain SQL files and not `prisma migrate`

`prisma db push` and `prisma migrate diff` both emit

```sql
ALTER TABLE "X" ALTER COLUMN "y" SET DATA TYPE TIMESTAMPTZ(3);
```

with **no `USING` clause**. Postgres then reinterprets every naive value in the
*session's* `TimeZone`. Run that from a laptop, or through pgbouncer with a
non-UTC session, and every timestamp in the database silently shifts — no error,
no warning. `003_timestamptz.sql` hand-writes `USING "y" AT TIME ZONE 'UTC'`,
which is the entire safety property of this migration.

This repo has never used `prisma migrate` (the live DB has no
`_prisma_migrations` table), so nothing is lost by staying with `db push` for
schema shape plus these scripts for the parts `db push` gets wrong.

## No user-defined SQL functions

Every file here is DDL or `SELECT` only. Nothing is `CREATE FUNCTION`-ed into
the database, so there is nothing to leave behind or drop later. The one piece
of logic that needed a helper — parsing the legacy `"09:00:AM"` format — lives
in TypeScript (`prisma/scripts/backfill-schedule-instants.ts`, importing
`src/lib/datetime.ts`), so the app and the migration share one implementation
and cannot disagree.

The three `CHECK` constraints added in `004_contract.sql` are constraints, not
functions. The day-match one relies on `timezone(text, timestamptz)` being
`IMMUTABLE`, which it is on PG16 (verified against `pg_proc`). On an older
server where it is `STABLE`, drop that constraint and keep the same assertion as
the audit query in `002_verify.sql`.

## Order

| Step | File | Reversible |
|---|---|---|
| 1 | `000_preflight.sql` — read-only gates; **all must pass** | n/a |
| 2 | `001_expand.sql` — additive columns + indexes | yes, `001_expand_down.sql` |
| 3 | `../../scripts/backfill-schedule-instants.ts` (tsx) | yes, `SET startsAt=NULL, endsAt=NULL` |
| 4 | `002_verify.sql` — the five invariants; **all must be 0** | n/a |
| 5 | `003_timestamptz.sql` — the type change | yes, `003_timestamptz_down.sql` |
| 6 | `004_contract.sql` — drops + CHECKs | **NO** |

Between 3 and 4, resolve any row with `needsTimeReview = true` by hand — see
`002_verify.sql`.

## Running

Applied via psql inside the stack (see the workspace `CLAUDE.md`; never run a
package manager on the host):

```sh
cd .orbstack
docker exec -i minar-postgres psql -U myuser -d myapp -v ON_ERROR_STOP=1 \
  -f - < ../minar-cruise/prisma/sql/2026-08-tz/000_preflight.sql
```

The backfill runs in the dev container:

```sh
docker exec --user node -w /workspace/minar-cruise minar-dev \
  npx tsx prisma/scripts/backfill-schedule-instants.ts
```

## Rehearsing against production data

`backup/<timestamp>/db.sql` restores into a scratch database. Note the custom
`db.dump` is pg_dump 18 and will **not** restore into the stack's PG16 — use the
plain `.sql`:

```sh
docker exec minar-postgres psql -U myuser -d postgres \
  -c 'DROP DATABASE IF EXISTS prodcopy; CREATE DATABASE prodcopy OWNER myuser;'
docker exec -i minar-postgres psql -U myuser -d prodcopy < backup/<ts>/db.sql
```

Production lags this branch (no `BookingLink`, `BookingConfig`, `SiteConfig`,
`AmenityItem`, `SiteSectionVisibility`), so `prisma db push` against the copy
rehearses both the schema catch-up and this migration.

Run the whole sequence twice — once on the prod copy, once on the seeded dev DB.
They exercise different branches of the legacy time parser: prod is entirely
zero-padded (`"09:00:AM"`), while `prisma/data/dbSchedule.ts` seeds the unpadded
`"4:30:PM"` form that the validator also permits.

## Governance, now that there is no migration history

After any schema change, this must produce an empty script:

```sh
prisma migrate diff --from-url "$DATABASE_URL" \
  --to-schema-datamodel prisma/schema.prisma --script
```

`migrate diff` works fine with no migration history, and it is the drift check
that `db push` alone never gives you.
