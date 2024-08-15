import { z } from "zod";
export const EnumScheduleTime = z.enum([
  "LUNCH",
  "DINNER",
  "BREAKFAST",
  "CUSTOM",
]);

export type TUpdatedDateSchedule = z.infer<typeof UpdatedDateScheduleSchema>;

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

export const UpdatedDateScheduleSchema = z.object({
  fromTime: ScheduleTime,
  toTime: ScheduleTime,
  packageId: z.string(),
  scheduleTime: EnumScheduleTime,
});

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

export const CompleteScheduleUpdateSchema = z.object({
  date: z.string(),
  schedule: ScheduleCreateSchema,
});

export type TScheduleSchema = z.infer<typeof ScheduleSchema>;
export type TScheduleCreateSchema = z.infer<typeof ScheduleCreateSchema>;
