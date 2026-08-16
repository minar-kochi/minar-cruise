-- 001_expand_down.sql — reverses 001_expand.sql.
--
-- Safe as long as the app has been rolled back to a version that does not read
-- startsAt/endsAt. The legacy fromTime/toTime columns are untouched by the
-- expand phase, so the pre-migration data is still complete and authoritative.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public."BookingLink"') IS NOT NULL THEN
    ALTER TABLE "BookingLink" DROP COLUMN IF EXISTS "scheduleEndsAt";
    ALTER TABLE "BookingLink" DROP COLUMN IF EXISTS "scheduleStartsAt";
  END IF;
END $$;

DROP INDEX IF EXISTS "Schedule_day_schedulePackage_key";
DROP INDEX IF EXISTS "Schedule_scheduleStatus_startsAt_idx";
DROP INDEX IF EXISTS "Schedule_startsAt_idx";

ALTER TABLE "Schedule" DROP COLUMN IF EXISTS "needsTimeReview";
ALTER TABLE "Schedule" DROP COLUMN IF EXISTS "isTimeOverridden";
ALTER TABLE "Schedule" DROP COLUMN IF EXISTS "endsAt";
ALTER TABLE "Schedule" DROP COLUMN IF EXISTS "startsAt";

ALTER TABLE "Package"  DROP COLUMN IF EXISTS "startMinutesIst";

COMMIT;
