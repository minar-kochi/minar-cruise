import { istMinutesSchema } from "@/lib/datetime";
import { z } from "zod";

export const PackageDetailsValidator = z.object({
  id: z.string().cuid(),
  title: z
    .string()
    .min(3, { message: "Title should have at least 3 characters" })
    .max(120, { message: "Title cannot exceed 120 characters" }),
  description: z
    .string()
    .min(10, { message: "Description should have at least 10 characters" }),
  packageType: z
    .string()
    .min(1, { message: "Package type is required" })
    .max(40, { message: "Package type cannot exceed 40 characters" }),
  /**
   * Rupees in the form, paise in the database. The router multiplies by 100 —
   * submitting paise here would be a 100x pricing error.
   */
  adultPrice: z
    .number({ invalid_type_error: "Adult price must be a number" })
    .min(0, { message: "Adult price cannot be negative" }),
  childPrice: z
    .number({ invalid_type_error: "Child price must be a number" })
    .min(0, { message: "Child price cannot be negative" }),
  /**
   * MINUTES, not hours — the seeded cruises are 120 / 180 / 240. Capping this
   * at 24 would reject every existing package.
   */
  duration: z
    .number({ invalid_type_error: "Duration must be a number" })
    .int({ message: "Duration must be a whole number" })
    .min(15, { message: "Duration must be at least 15 minutes" })
    .max(1440, { message: "Duration cannot exceed 24 hours (1440 minutes)" }),
  /**
   * Departure as minutes from IST midnight, straight from a `<input type="time">`.
   *
   * Replaces a `fromTime`/`toTime` pair of `"6:30:AM"` strings. There is no
   * `toTime` any more because there never really was one: the router discarded
   * it and derived the return from `duration`, so an admin could type a return
   * time that contradicted the duration and silently have it ignored.
   */
  startMinutesIst: istMinutesSchema,
});

export const AmenityItemValidator = z.object({
  /** Absent for a newly added row that has not been saved yet. */
  id: z.string().cuid().optional(),
  label: z
    .string()
    .min(2, { message: "Amenity needs at least 2 characters" })
    .max(160, { message: "Amenity cannot exceed 160 characters" }),
  isVisible: z.boolean(),
});

export const UpdateAmenityItemsValidator = z.object({
  packageId: z.string().cuid(),
  /** Array order is the display order — index becomes `AmenityItem.order`. */
  items: z.array(AmenityItemValidator).max(50, {
    message: "That is more amenities than a package can list",
  }),
});

/**
 * Per-package booking rules, edited on the package's Settings tab.
 *
 * `null` on either number means "follow the site-wide default" in
 * /admin/settings/booking. `minNewBookingCount: 0` is the distinct third state:
 * this package has no party-size floor at all (how Sunset runs).
 */
export const PackageSettingsValidator = z.object({
  id: z.string().cuid(),
  minLeadTimeHours: z
    .number({ invalid_type_error: "Lead time must be a number" })
    .min(0, { message: "Lead time cannot be negative" })
    .max(720, { message: "Lead time cannot exceed 720 hours (30 days)" })
    .nullable(),
  minNewBookingCount: z
    .number({ invalid_type_error: "Minimum guests must be a number" })
    .int({ message: "Minimum guests must be a whole number" })
    .min(0, { message: "Minimum guests cannot be negative" })
    .nullable(),
  isBookableOnline: z.boolean(),
  isVisible: z.boolean(),
});

export type TPackageDetailsValidator = z.infer<typeof PackageDetailsValidator>;
export type TPackageSettingsValidator = z.infer<
  typeof PackageSettingsValidator
>;
export type TAmenityItemValidator = z.infer<typeof AmenityItemValidator>;
export type TUpdateAmenityItemsValidator = z.infer<
  typeof UpdateAmenityItemsValidator
>;
