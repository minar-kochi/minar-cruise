-- 002_verify.sql — the five invariants. Pure SELECT; no functions, no writes.
-- Run after the backfill. EVERY count must be 0 before the contract phase.
--
-- Also safe to run against production read-only at any time, as a standing
-- audit — same role as scripts/audit-mismatched-bookings.sql.

\echo ''
\echo '=== 1. Non-BLOCKED schedules missing an instant ==='
-- A sailing customers can book must know when it leaves and returns.
-- Immediately after the backfill this may be 1 — the row the backfill refused
-- to guess at. Resolve it (see the report at the bottom) and re-run.
-- REQUIRE: 0
SELECT count(*) AS missing_instants
FROM "Schedule"
WHERE "scheduleStatus" <> 'BLOCKED'
  AND ("startsAt" IS NULL OR "endsAt" IS NULL);

\echo ''
\echo '=== 2. BLOCKED schedules that acquired an instant ==='
-- A block marks "this slot is closed on this day". It has no departure, and
-- giving it one would make it look bookable to any query filtering on startsAt.
-- REQUIRE: 0
SELECT count(*) AS blocked_with_instants
FROM "Schedule"
WHERE "scheduleStatus" = 'BLOCKED'
  AND ("startsAt" IS NOT NULL OR "endsAt" IS NOT NULL);

\echo ''
\echo '=== 3. startsAt IST calendar day <> day  [THE load-bearing invariant] ==='
-- This is the whole point of the migration. `day` is what the customer picked
-- and what the payment resolver matches on; `startsAt` is what every screen
-- renders. If they can disagree, a customer can pay for one date and be
-- ticketed for another. 004_contract.sql freezes this as a CHECK constraint.
-- REQUIRE: 0
SELECT count(*) AS day_mismatch
FROM "Schedule"
WHERE "startsAt" IS NOT NULL
  AND ("startsAt" AT TIME ZONE 'Asia/Kolkata')::date <> "day";

\echo ''
\echo '=== 4. Implausible sailing durations ==='
-- Longest legitimate cruise is 4h (max Package.duration = 240); longest
-- observed override is 5h. Anything outside 15min..6h means the midnight-roll
-- heuristic fired when it should not have.
-- REQUIRE: 0
SELECT count(*) AS implausible_duration
FROM "Schedule"
WHERE "endsAt" IS NOT NULL
  AND ("endsAt" - "startsAt") NOT BETWEEN interval '15 minutes' AND interval '6 hours';

\echo ''
\echo '=== 5. Paying customers attached to a schedule with no departure ==='
-- REQUIRE: 0
SELECT count(*) AS bookings_without_departure
FROM "Booking" b
JOIN "Schedule" s ON s.id = b."scheduleId"
WHERE s."startsAt" IS NULL;

\echo ''
\echo '=== Coverage summary (expect 495 / 23 / 229 on the 2026-08-16 dump) ==='
SELECT
  "scheduleStatus",
  count(*)                                        AS rows,
  count("startsAt")                               AS with_start,
  count("endsAt")                                 AS with_end,
  count(*) FILTER (WHERE "isTimeOverridden")      AS overridden,
  count(*) FILTER (WHERE "needsTimeReview")       AS flagged
FROM "Schedule"
GROUP BY 1 ORDER BY 1;

\echo ''
\echo '=== Rows needing human review ==='
-- Everything an operator needs to decide, in one row. The backfill deliberately
-- does NOT guess when fromTime is after toTime by more than a plausible
-- overnight sailing: on the production dump this catches 2025-11-13
-- "11:00:PM" -> "03:00:PM", which is a typo for 11:00:AM, not a 16-hour cruise.
SELECT
  s.id, s.day, s."scheduleStatus", s."fromTime", s."toTime",
  p.title       AS package,
  p."fromTime"  AS pkg_departs,
  p."toTime"    AS pkg_returns,
  (SELECT count(*) FROM "Booking" b WHERE b."scheduleId" = s.id) AS bookings
FROM "Schedule" s
LEFT JOIN "Package" p ON p.id = s."packageId"
WHERE s."needsTimeReview"
ORDER BY s.day;

\echo ''
\echo '=== Overrides rendered back into IST (eyeball check) ==='
-- 2025-11-23 must read: starts 10:00 PM on the 23rd, ends 12:00 AM on the 24th.
SELECT
  s.day,
  s."fromTime", s."toTime",
  to_char(s."startsAt" AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD HH12:MI AM') AS starts_ist,
  to_char(s."endsAt"   AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD HH12:MI AM') AS ends_ist
FROM "Schedule" s
WHERE s."isTimeOverridden"
ORDER BY s.day;
