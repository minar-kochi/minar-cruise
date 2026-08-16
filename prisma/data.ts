import {
  Amenities,
  FoodMenu,
  Package,
  Schedule,
  User,
  Image,
  Booking,
  PackageImage,
} from "@prisma/client";

export type bookingPartialId = (Omit<Booking, "id" | "createdAt"> & {
  id?: string;
})[];
export type packagesPartialId = (Omit<
  Package,
  | "createdAt"
  | "isVisible"
  | "minLeadTimeHours"
  | "minNewBookingCount"
  | "isBookableOnline"
> & {
  id?: string;
  /** All default in the database; seed rows need not spell them out. */
  isVisible?: boolean;
  /** null = follow the site-wide default. */
  minLeadTimeHours?: number | null;
  /** null = follow the default; 0 = no minimum. */
  minNewBookingCount?: number | null;
  isBookableOnline?: boolean;
})[];
export type foodMenuPartialId = (Omit<FoodMenu, "id"> & { id?: string })[];
/**
 * Seed shape. `startsAt`/`endsAt`/`isTimeOverridden`/`needsTimeReview` are
 * deliberately not authorable here: they are DERIVED from (day + time) by
 * `deriveScheduleInstants`, and a hand-written instant in seed data is exactly
 * the kind of second source of truth this migration removed. A seeder that
 * inserts these rows should compute them.
 */
export type schedulePartialId = (Omit<
  Schedule,
  "id" | "startsAt" | "endsAt" | "isTimeOverridden" | "needsTimeReview"
> & { id?: string })[];
/**
 * Seed shape only. `Amenities` no longer has a `description` column — the
 * bullets live in `AmenityItem` rows now — so seed.ts expands these strings
 * into items rather than passing them straight to `amenities.createMany`.
 */
export type amenitiesPartialId = { id?: string; description: string[] }[];
export type userPartialId = (Omit<User, "id"> & { id?: string })[];
export type imagesPartialId = (Omit<Image, "id"> & { id?: string })[];
export type packageImagePartialId = (Omit<PackageImage, "id" | "ImageUse"> & {
  id?: string;
  ImageUse?: "COMMON" | "PROD_FEATURED" | "PROD_THUMBNAIL";
})[];

import { amenities } from "./data/dbAmenities";
import { booking } from "./data/dbBooking";
import { foodMenu } from "./data/dbFoodMenu";
import { image } from "./data/DbImageData";
import { packageImage } from "./data/dbPackageImage";
import { packages } from "./data/dbPackage";
import { schedule } from "./data/dbSchedule";
import { users } from "./data/dbUserData";
import { parseUploadThingData } from "./functions/parseUploadThingData";

export { amenities };
export { booking };
export { foodMenu };
export { image };
export { packageImage };
export { packages };
export { schedule };
export { users };
export const imageData = parseUploadThingData();
