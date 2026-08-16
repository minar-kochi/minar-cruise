-- 002_resolve_known_typos.sql
--
-- Data corrections for rows the backfill deliberately refused to guess at.
-- Run BETWEEN the backfill and 002_verify.sql, then re-run the backfill (it is
-- idempotent) so the corrected rows get their instants.
--
-- The backfill flags rather than guesses on purpose: silently rolling a return
-- time past midnight to make it sort correctly would have invented a 16-hour
-- cruise here. Every correction in this file is a human decision, recorded with
-- the evidence that supports it.
--
-- Idempotent and targeted by id: re-running is a no-op once applied, and it
-- cannot touch a row it was not written for.

BEGIN;

-- ---------------------------------------------------------------------------
-- 2025-11-13, EXCLUSIVE, "Exlusive Packages"
--
-- Stored as fromTime "11:00:PM" -> toTime "03:00:PM", i.e. a return 8 hours
-- BEFORE its departure. Confirmed as a typo by the site owner.
--
-- The correction is fromTime "11:00:AM", not a change to toTime, because that
-- reading is self-consistent: 11:00 AM -> 03:00 PM is 240 minutes, exactly the
-- `duration` of the "Exlusive Packages" package this schedule belongs to. The
-- alternative (treating toTime as wrong) would have to invent a return time
-- with nothing to check it against.
--
-- Safe: the date is in the past and the row has zero bookings.
UPDATE "Schedule"
SET "fromTime" = '11:00:AM'
WHERE id = 'cmggbnj850069o90kqaibjw7y'
  AND "fromTime" = '11:00:PM'
  AND "toTime" = '03:00:PM'
  AND NOT EXISTS (SELECT 1 FROM "Booking" b WHERE b."scheduleId" = "Schedule".id);

COMMIT;

-- Verify the guard held — 0 means it was already applied, or the row no longer
-- matches (in which case investigate rather than force it).
SELECT id, day, "fromTime", "toTime", "needsTimeReview"
FROM "Schedule"
WHERE id = 'cmggbnj850069o90kqaibjw7y';
