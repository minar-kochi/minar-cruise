import { z } from "zod";

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
