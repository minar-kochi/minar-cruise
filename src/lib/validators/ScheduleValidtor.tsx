import { z } from "zod";

export const ScheduleSchema = z.object({
  ScheduleDate: z.number({
    required_error: "schedule date is required",
  }),
});

export type TScheduleSchema = z.infer<typeof ScheduleSchema>;
