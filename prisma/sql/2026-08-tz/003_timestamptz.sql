-- 003_timestamptz.sql — make every instant column timezone-aware.
--
-- THE `USING` CLAUSE IS THE ENTIRE POINT OF THIS FILE.
--
-- `prisma db push` and `prisma migrate diff` both emit a bare
--     ALTER COLUMN "x" SET DATA TYPE TIMESTAMPTZ(3)
-- with no USING. Postgres then reinterprets every stored value in the SESSION's
-- TimeZone. Run that from a laptop in IST, or through a pooler that does not
-- pin the GUC, and every timestamp in the database silently moves by 5h30m —
-- no error, no warning, and nothing to notice until a customer complains.
--
-- `USING "x" AT TIME ZONE 'UTC'` states the interpretation explicitly, so the
-- result is identical no matter who runs it from where.
--
-- The premise — that these naive columns hold UTC — is not assumed. It is
-- checked in 000_preflight.sql gate A against Razorpay's own epoch in
-- Events.payload: 1728 rows, average delta +183s (webhook processing lag), zero
-- rows anywhere near the 19800s that an IST-naive column would show.
--
-- Locking: ALTER ... TYPE takes ACCESS EXCLUSIVE and rewrites each table. The
-- largest here is Payments at ~1.9k rows, so this is milliseconds — but the
-- lock is total, so still prefer a quiet moment.
--
-- One ALTER per table so each table is rewritten exactly once.

SET TIME ZONE 'UTC';  -- belt and braces; the USING clauses make it redundant

BEGIN;

ALTER TABLE "AmenityItem"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Blog"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "BlogSeo"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Booking"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "BookingConfig"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "BookingLink"
  ALTER COLUMN "paidAt" TYPE timestamptz(3) USING "paidAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "expiresAt" TYPE timestamptz(3) USING "expiresAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Events"
  ALTER COLUMN "lastProcessingAttempt" TYPE timestamptz(3) USING "lastProcessingAttempt" AT TIME ZONE 'UTC',
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Image"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Package"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "PackageSeo"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Payments"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Schedule"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Seo"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "SiteConfig"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "SiteSectionVisibility"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "TaxConfiguration"
  ALTER COLUMN "createdAt" TYPE timestamptz(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamptz(3) USING "updatedAt" AT TIME ZONE 'UTC';

COMMIT;

-- Confirm nothing naive is left. Expect 0.
SELECT count(*) AS remaining_naive_timestamp_columns
FROM information_schema.columns
WHERE table_schema = 'public' AND data_type = 'timestamp without time zone';
