import { z } from "zod";

export const BookingConfigValidator = z.object({
  maxBoatSeat: z
    .number({ invalid_type_error: "Boat capacity must be a number" })
    .int({ message: "Boat capacity must be a whole number" })
    .min(1, { message: "Boat capacity must be at least 1" })
    .max(1000, { message: "Boat capacity cannot exceed 1000" }),
  defaultMinLeadTimeHours: z
    .number({ invalid_type_error: "Default lead time must be a number" })
    .min(0, { message: "Lead time cannot be negative" })
    .max(720, { message: "Lead time cannot exceed 720 hours (30 days)" }),
  defaultMinNewBookingCount: z
    .number({ invalid_type_error: "Default minimum must be a number" })
    .int({ message: "Default minimum must be a whole number" })
    .min(1, { message: "Default minimum must be at least 1" }),
});

export type TBookingConfigValidator = z.infer<typeof BookingConfigValidator>;
