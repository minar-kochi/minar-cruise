import { isDate, isValid } from "date-fns";
import { z } from "zod";

export const ScheduleSchema = z.object({
  ScheduleDate: z.string({
    required_error: "Schedule date is required",
  }),
});

export const ScheduleCreateSchema = ScheduleSchema.extend({
  packageId: z.string({
    message: "Package Id is required",
  }),
  ScheduleTime: z.enum(["LUNCH", "DINNER", "BREAKFAST", "CUSTOM"]),
});

export type TScheduleSchema = z.infer<typeof ScheduleSchema>;
export type TScheduleCreateSchema = z.infer<typeof ScheduleCreateSchema>;
