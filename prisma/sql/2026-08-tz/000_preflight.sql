-- 000_preflight.sql — read-only gates. Nothing here writes.
-- Every REQUIRE below must hold before 001_expand.sql runs.
-- Verified green against the 2026-08-16 production dump during planning.
--
-- Run with:
--   docker exec -i minar-postgres psql -U myuser -d <db> -v ON_ERROR_STOP=1 \
--     -f - < prisma/sql/2026-08-tz/000_preflight.sql

\echo ''
\echo '=== A. Are the naive timestamps UTC (not IST)? ==='
-- THE load-bearing assumption of 003_timestamptz.sql. If these columns were
-- IST-naive, `USING col AT TIME ZONE 'UTC'` would shift every row by 5h30m.
-- Events.payload carries Razorpay's own epoch, so the column can be checked
-- against an independent clock. Processing lag makes small positive deltas
-- normal; a systematic ~19800s offset would mean IST.
-- REQUIRE: near_ist_offset = 0
SELECT
  count(*)                                                   AS checked,
  round(avg(extract(epoch FROM (e."createdAt" AT TIME ZONE 'UTC')
       - to_timestamp((e.payload->'order'->'entity'->>'created_at')::bigint)))) AS avg_delta_sec,
  count(*) FILTER (
    WHERE abs(abs(extract(epoch FROM (e."createdAt" AT TIME ZONE 'UTC')
       - to_timestamp((e.payload->'order'->'entity'->>'created_at')::bigint))) - 19800) < 300
  )                                                          AS near_ist_offset
FROM "Events" e
WHERE e.payload->'order'->'entity'->>'created_at' IS NOT NULL;

\echo ''
\echo '=== B. Do all package legacy times parse? ==='
-- The regex mirrors PackageContentValidator.timeString, including the
-- deliberately-permitted unpadded hour (0?[1-9]).
-- REQUIRE: 0
SELECT count(*) AS unparseable_package_times
FROM "Package"
WHERE "fromTime" !~ '^(0?[1-9]|1[0-2]):[0-5][0-9]:(AM|PM)$'
   OR "toTime"   !~ '^(0?[1-9]|1[0-2]):[0-5][0-9]:(AM|PM)$';

\echo ''
\echo '=== C. Is Package.duration already exactly (toTime - fromTime)? ==='
-- If yes, `toTime` is redundant and `duration` can become the single source of
-- the end time. Verified exact for all 9 production packages.
-- REQUIRE: 0
WITH m AS (
  SELECT id,
    ((split_part("fromTime",':',1)::int % 12)
      + CASE WHEN split_part("fromTime",':',3)='PM' THEN 12 ELSE 0 END)*60
      + split_part("fromTime",':',2)::int AS from_min,
    ((split_part("toTime",':',1)::int % 12)
      + CASE WHEN split_part("toTime",':',3)='PM' THEN 12 ELSE 0 END)*60
      + split_part("toTime",':',2)::int   AS to_min,
    duration
  FROM "Package"
)
SELECT count(*) AS duration_mismatch
FROM m WHERE ((to_min - from_min) + 1440) % 1440 <> duration;

\echo ''
\echo '=== D. Will @@unique([day, schedulePackage]) build? ==='
-- REQUIRE: 0
SELECT count(*) AS duplicate_day_slot
FROM (SELECT day, "schedulePackage" FROM "Schedule" GROUP BY 1,2 HAVING count(*) > 1) d;

\echo ''
\echo '=== E. Does any booking hang off a schedule that will end up timeless? ==='
-- Rows with no packageId AND no fromTime cannot be given an instant. If any
-- booking pointed at one, startsAt could not be nullable. Production: 0 —
-- all 1849 bookings sit on AVAILABLE schedules.
-- REQUIRE: 0
SELECT count(*) AS bookings_on_timeless_schedules
FROM "Booking" b
JOIN "Schedule" s ON s.id = b."scheduleId"
WHERE s."packageId" IS NULL AND s."fromTime" IS NULL;

\echo ''
\echo '=== F. Expected schedule class distribution (informational) ==='
-- Production at 2026-08-16: 495 AVAILABLE / 23 EXCLUSIVE / 229 BLOCKED.
SELECT
  "scheduleStatus",
  count(*)                                                        AS rows,
  count(*) FILTER (WHERE "fromTime" IS NOT NULL)                  AS with_override,
  count(*) FILTER (WHERE "packageId" IS NOT NULL)                 AS with_package,
  count(*) FILTER (WHERE "packageId" IS NULL AND "fromTime" IS NULL) AS timeless
FROM "Schedule"
GROUP BY 1 ORDER BY 1;
