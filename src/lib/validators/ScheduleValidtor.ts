import { z } from "zod";
export const EnumScheduleTime = z.enum([
  "LUNCH",
  "DINNER",
  "BREAKFAST",
  "CUSTOM",
]);

export const UpdatedDateScheduleSchema = z.object({
  fromTime: z.string().optional(),
  toTime: z.string().optional(),
  packageId: z.string(),
  scheduleTime: EnumScheduleTime,
});

export type TUpdatedDateSchedule = z.infer<typeof UpdatedDateScheduleSchema>;
export const CompleteScheduleUpdateSchema = z.object({
  date: z.string(),
  schedule: UpdatedDateScheduleSchema,
});

export const ScheduleSchema = z.object({
  ScheduleDate: z.string({
    required_error: "Schedule date is required",
  }),
});

export const ScheduleTime = z
  .object({
    hours: z.string(),
    min: z.string(),
    Cycle: z.enum(["AM", "PM"]),
  })
  .optional();
export const ScheduleCreateSchema = ScheduleSchema.extend({
  packageId: z
    .string({
      message: "Package Id is required",
    })
    .optional(),
  ScheduleTime: EnumScheduleTime,
  ScheduleDateTime: z
    .object({
      fromTime: ScheduleTime,
      toTime: ScheduleTime,
    })
    .optional(),
});

export type TScheduleSchema = z.infer<typeof ScheduleSchema>;
export type TScheduleCreateSchema = z.infer<typeof ScheduleCreateSchema>;
