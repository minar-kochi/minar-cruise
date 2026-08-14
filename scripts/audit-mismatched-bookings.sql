-- Bookings that may have been attached to the wrong Schedule.
--
-- Run with:  docker exec -i minar-postgres psql -U myuser -d myapp -f - < scripts/audit-mismatched-bookings.sql
-- (or paste into `make db-psql`). Read-only.
--
-- WHY THIS IS HEURISTIC AND NOT EXACT
-- ------------------------------------
-- The customer's chosen date is NOT stored anywhere for the affected path.
-- For a `schedule.existing` order the Razorpay notes record
--   scheduledDate: format(schedule.day, "dd-MM-yyyy")
-- i.e. the day of the schedule the server ALREADY resolved — not the
-- `selectedScheduleDate` the customer submitted. So on exactly the orders that
-- went wrong, the note agrees with Schedule.day by construction and the
-- mismatch is invisible. (Only `schedule.create` orders carry the customer's own
-- date in `notes.date`, and that path re-resolves by date in the webhook, so it
-- was never affected.)
--
-- What follows therefore looks for the *shapes* the bug produces rather than
-- proving intent. Flag A is conclusive; flag B needs human review.

SELECT
  b.id                                                        AS booking_id,
  u.name                                                      AS customer,
  u.email,
  u.contact,
  b."createdAt"                                               AS booked_at,
  s.day                                                       AS sailed_on,
  s."schedulePackage"                                         AS slot,
  p.title                                                     AS package,
  (s.day::date - b."createdAt"::date)                         AS days_ahead,
  e.payload -> 'order' -> 'entity' ->> 'id'                   AS razorpay_order_id,
  CASE
    -- A. Conclusive: attached to a schedule that had already sailed when the
    --    booking was made. No legitimate flow can produce this — the lead-time
    --    gate rejects past dates. This is the stale-scheduleId defect.
    WHEN s.day::date < b."createdAt"::date THEN 'A: schedule already in the past'
    -- B. Suspicious: booked for the same day it was created. This is the
    --    signature of the carried-over-date defect, where the form silently
    --    submitted `today` while showing a future date. Genuine same-day
    --    bookings also land here, so check each against the customer's emails
    --    before contacting them.
    WHEN s.day::date = b."createdAt"::date THEN 'B: same-day, needs review'
  END                                                         AS flag
FROM "Booking" b
JOIN "Schedule" s ON s.id = b."scheduleId"
LEFT JOIN "Package" p ON p.id = s."packageId"
LEFT JOIN "User" u ON u.id = b."userId"
LEFT JOIN "Events" e ON e."bookingId" = b.id
WHERE s.day::date <= b."createdAt"::date
ORDER BY
  CASE WHEN s.day::date < b."createdAt"::date THEN 0 ELSE 1 END,
  b."createdAt" DESC;
