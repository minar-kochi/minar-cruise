-- 003_timestamptz_down.sql — reverses 003_timestamptz.sql.
--
-- `timestamptz AT TIME ZONE 'UTC'` yields the naive UTC wall-clock value, which
-- is exactly what the columns held before. Round-trips losslessly.

SET TIME ZONE 'UTC';

BEGIN;

ALTER TABLE "AmenityItem"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Blog"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "BlogSeo"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Booking"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "BookingConfig"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "BookingLink"
  ALTER COLUMN "paidAt" TYPE timestamp(3) USING "paidAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "expiresAt" TYPE timestamp(3) USING "expiresAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Events"
  ALTER COLUMN "lastProcessingAttempt" TYPE timestamp(3) USING "lastProcessingAttempt" AT TIME ZONE 'UTC',
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Image"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Package"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "PackageSeo"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Payments"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Schedule"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "Seo"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "SiteConfig"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "SiteSectionVisibility"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

ALTER TABLE "TaxConfiguration"
  ALTER COLUMN "createdAt" TYPE timestamp(3) USING "createdAt" AT TIME ZONE 'UTC',
  ALTER COLUMN "updatedAt" TYPE timestamp(3) USING "updatedAt" AT TIME ZONE 'UTC';

COMMIT;
