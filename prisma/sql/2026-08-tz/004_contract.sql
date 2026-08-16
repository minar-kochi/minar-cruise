-- 004_contract.sql — drop the split representation and freeze the invariants.
--
-- THIS IS THE ONLY IRREVERSIBLE STEP. After it, the legacy time strings are
-- gone and the only way back is the dump.
--
-- Do not run until ALL of these hold:
--   1. The application version that READS startsAt/endsAt has been live long
--      enough to cover the longest booking lead time in the data — 16h for
--      breakfast (Package.minLeadTimeHours), so at least 3 days.
--   2. `SELECT count(*) FROM "Schedule" WHERE "needsTimeReview"` = 0.
--   3. All five invariants in 002_verify.sql are 0 against LIVE production,
--      not just a restored copy.
--   4. `prisma migrate diff --from-url "$DATABASE_URL"
--       --to-schema-datamodel prisma/schema.prisma --script` is empty.
--   5. A fresh `make db-dump` has been taken AND confirmed restorable.

BEGIN;

-- ---------------------------------------------------------------- Package
ALTER TABLE "Package" ALTER COLUMN "startMinutesIst" SET NOT NULL;

ALTER TABLE "Package" DROP CONSTRAINT IF EXISTS "Package_startMinutesIst_range";
ALTER TABLE "Package" ADD CONSTRAINT "Package_startMinutesIst_range"
  CHECK ("startMinutesIst" >= 0 AND "startMinutesIst" < 1440);

-- Duration is now the sole source of the return time, so it must be sane.
ALTER TABLE "Package" DROP CONSTRAINT IF EXISTS "Package_duration_range";
ALTER TABLE "Package" ADD CONSTRAINT "Package_duration_range"
  CHECK ("duration" > 0 AND "duration" <= 1440);

ALTER TABLE "Package" DROP COLUMN IF EXISTS "fromTime";
ALTER TABLE "Package" DROP COLUMN IF EXISTS "toTime";

-- --------------------------------------------------------------- Schedule
-- A bookable sailing must know when it leaves and returns. A BLOCKED row is a
-- slot marker with no sailing, so it legitimately has neither.
ALTER TABLE "Schedule" DROP CONSTRAINT IF EXISTS "Schedule_instants_present";
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_instants_present"
  CHECK (
    "scheduleStatus" = 'BLOCKED'
    OR ("startsAt" IS NOT NULL AND "endsAt" IS NOT NULL)
  );

ALTER TABLE "Schedule" DROP CONSTRAINT IF EXISTS "Schedule_instants_ordered";
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_instants_ordered"
  CHECK ("endsAt" IS NULL OR "startsAt" IS NULL OR "endsAt" > "startsAt");

-- THE one that makes the original bug structurally impossible.
--
-- `day` is what the customer picked and what the payment resolver matches on;
-- `startsAt` is what every screen renders. Before this migration they were
-- recombined at each read by host-timezone-dependent code, so they could
-- disagree — which is how a customer could be shown one date and ticketed for
-- another. Now the database refuses to store a row where they differ.
--
-- Legal in a CHECK because timezone(text, timestamptz) is IMMUTABLE on PG16
-- (verified against pg_proc). If this ever has to run on a server where it is
-- STABLE, drop this constraint and keep the same assertion as the standing
-- audit query in 002_verify.sql.
ALTER TABLE "Schedule" DROP CONSTRAINT IF EXISTS "Schedule_day_matches_startsAt";
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_day_matches_startsAt"
  CHECK (
    "startsAt" IS NULL
    OR ("startsAt" AT TIME ZONE 'Asia/Kolkata')::date = "day"
  );

ALTER TABLE "Schedule" DROP COLUMN IF EXISTS "fromTime";
ALTER TABLE "Schedule" DROP COLUMN IF EXISTS "toTime";

-- Migration triage only; every row has been resolved by now.
ALTER TABLE "Schedule" DROP COLUMN IF EXISTS "needsTimeReview";

-- ------------------------------------------------------------ BookingLink
-- Guarded: this table does not exist in production until the
-- feat/admin-controlled-packages branch ships.
DO $$
BEGIN
  IF to_regclass('public."BookingLink"') IS NOT NULL THEN
    ALTER TABLE "BookingLink" ALTER COLUMN "scheduleStartsAt" SET NOT NULL;
    ALTER TABLE "BookingLink" ALTER COLUMN "scheduleEndsAt"   SET NOT NULL;
    ALTER TABLE "BookingLink" DROP CONSTRAINT IF EXISTS "BookingLink_schedule_ordered";
    ALTER TABLE "BookingLink" ADD CONSTRAINT "BookingLink_schedule_ordered"
      CHECK ("scheduleEndsAt" > "scheduleStartsAt");
  END IF;
END $$;

COMMIT;

-- Nothing user-defined was ever created in the database by this migration, so
-- there is no function to drop here.

\echo ''
\echo '=== Constraints now enforcing the model ==='
SELECT conrelid::regclass AS table, conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE contype = 'c'
  AND conrelid::regclass::text IN ('"Schedule"', '"Package"', '"BookingLink"', 'Schedule', 'Package', 'BookingLink')
ORDER BY 1, 2;
