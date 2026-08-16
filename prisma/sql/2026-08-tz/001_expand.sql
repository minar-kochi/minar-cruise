-- 001_expand.sql — additive only. Nothing here drops or rewrites existing data.
-- Safe to run while the old app version is serving traffic: the new columns are
-- nullable and unread until the app that dual-writes them is deployed.
--
-- Reverse with 001_expand_down.sql.

BEGIN;

-- Package: departure as minutes from IST midnight. Nullable for now; set NOT
-- NULL in 004_contract.sql once the backfill has populated it.
-- The end time is `startMinutesIst + duration` — verified already exactly equal
-- to (toTime - fromTime) for all 9 production packages, so `duration` becomes
-- the single source of the return time and the two can no longer drift apart.
ALTER TABLE "Package"  ADD COLUMN IF NOT EXISTS "startMinutesIst" integer;

-- Schedule: the sailing as two absolute instants, resolved once at write time.
-- NULL is legitimate and permanent for BLOCKED rows, which mark "this slot is
-- closed on this day" and have no departure at all (229 such rows in
-- production, referenced by zero bookings).
ALTER TABLE "Schedule" ADD COLUMN IF NOT EXISTS "startsAt" timestamptz(3);
ALTER TABLE "Schedule" ADD COLUMN IF NOT EXISTS "endsAt"   timestamptz(3);

-- True when this schedule's times differ from its package's defaults — the old
-- fromTime/toTime override. Informational, for the admin UI; startsAt/endsAt
-- are always the authority.
ALTER TABLE "Schedule"
  ADD COLUMN IF NOT EXISTS "isTimeOverridden" boolean NOT NULL DEFAULT false;

-- Set by the backfill when a legacy time pair could not be interpreted (see
-- 002_verify.sql). A human resolves these before the contract phase; the column
-- is dropped there.
ALTER TABLE "Schedule"
  ADD COLUMN IF NOT EXISTS "needsTimeReview" boolean NOT NULL DEFAULT false;

-- Supports "next sailing" and lead-time sweeps, and replaces
-- `ORDER BY day, "fromTime"` in getSelectableSchedulesForLink — that ordering
-- was lexicographic over "09:00:AM" / "4:30:PM", which sorted 4:30 PM before
-- 9:00 AM.
CREATE INDEX IF NOT EXISTS "Schedule_startsAt_idx"
  ON "Schedule" ("startsAt");
CREATE INDEX IF NOT EXISTS "Schedule_scheduleStatus_startsAt_idx"
  ON "Schedule" ("scheduleStatus", "startsAt");

-- Nothing at the DB level previously stopped two rows sharing a (day, slot),
-- which is why resolveScheduleForPackageDate has to disambiguate. Production is
-- already clean (0 duplicates, checked in 000_preflight.sql), so this builds —
-- and if it ever fails on another environment, that is a data problem worth
-- discovering here rather than at pay time.
CREATE UNIQUE INDEX IF NOT EXISTS "Schedule_day_schedulePackage_key"
  ON "Schedule" ("day", "schedulePackage");

-- BookingLink: snapshot the departure this link was sold against, so an admin
-- editing a package's time cannot silently move links already sent to
-- customers. Guarded because this table does not exist in production yet —
-- it arrives with the feat/admin-controlled-packages branch. Where it does
-- exist (dev/staging), the columns start nullable and the backfill fills them.
DO $$
BEGIN
  IF to_regclass('public."BookingLink"') IS NOT NULL THEN
    ALTER TABLE "BookingLink" ADD COLUMN IF NOT EXISTS "scheduleStartsAt" timestamptz(3);
    ALTER TABLE "BookingLink" ADD COLUMN IF NOT EXISTS "scheduleEndsAt"   timestamptz(3);
  END IF;
END $$;

COMMIT;

-- 747 schedules / 1849 bookings: every statement above is sub-second, so plain
-- (non-CONCURRENT) index builds are fine.
