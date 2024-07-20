import { z } from "zod";

export const ScheduleSchema = z.object({
  ScheduleDate: z.union([
    z.number({
      required_error: "schedule date is required",
    }),
    z.string({
      required_error: "Schedule date is required",
    }),
    z.date({
      required_error: "Schedule date is required",
    }),
  ]),
});

export type TScheduleSchema = z.infer<typeof ScheduleSchema>;
