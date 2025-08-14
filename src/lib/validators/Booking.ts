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
  bookingId: z
  .string()
  .min(
    25,
    "Booking ID length is too short, please provide a valid booking Id",
  )
  .cuid({
    message: "Id validation failed,please provide a valid booking Id",
  }),
})
