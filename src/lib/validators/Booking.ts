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

export const BookingCuidValidator = z.object({
  bookingId: z
    .string()
    // .regex(cuidRegex, "Invalid Booking Id")
    // .length(25, "Invalid Booking Id"),
})
