import { $Enums } from "@prisma/client";
import { z } from "zod";
type ES = (keyof typeof $Enums.SCHEDULE_PACKAGE)[];
const ts = Object.keys($Enums.SCHEDULE_PACKAGE)
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

export const ScheduleCreateSchema = ScheduleSchema.extend({
  packageId: z.string({
    message: "Package Id is required",
  }),
  ScheduleTime: z.enum(["LUNCH", "DINNER", "BREAKFAST"])
});

export type TScheduleSchema = z.infer<typeof ScheduleSchema>;
export type TScheduleCreateSchema = z.infer<typeof ScheduleCreateSchema>;
