import { z } from "zod";
import { cuidRegex } from "../helpers/regex";

export const updateScheduleIdOfBooking = z.object({
  toScheduleId: z.string(),
  idOfBookingToBeUpdated: z.string(),
});

export type TUpdateScheduleIdOfBooking = z.infer<
  typeof updateScheduleIdOfBooking
>;

export const moveAllBookingsSchema = z
  .object({
    fromScheduleId: z.string(),
    toScheduleId: z.string(),
  })
  .refine((val) => val.fromScheduleId !== val.toScheduleId, {
    message: "From and To schedule ID must bew different",
    path: ["ScheduleId"],
  });

export type TMoveAllBookingsSchema = z.infer<typeof moveAllBookingsSchema>;

export type TBookingCuidValidator = z.infer<typeof BookingCuidValidator>
export const BookingCuidValidator = z.object({
  bookingId: z.string()
    .min(24, "Booking ID too short")
    .max(25, "Booking ID too long")
    .refine((val) => {
      // Check if it's a legacy CUID (25 chars, starts with 'c')
      if (val.length === 25 && val.startsWith('c')) {
        return /^c[a-z0-9]{24}$/.test(val);
      }
      // Check if it's a CUID2 (24 chars, no 'c' prefix)
      if (val.length === 24) {
        return /^[a-z0-9]{24}$/.test(val);
      }
      return false;
    }, {
      message: "Invalid booking ID format."
    })
});
