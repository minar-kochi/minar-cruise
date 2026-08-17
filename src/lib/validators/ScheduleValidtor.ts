import { istDayKeySchema, istMinutesSchema } from "@/lib/datetime";
import { z } from "zod";
export const EnumScheduleTime = z.enum([
  "LUNCH",
  "DINNER",
  "SUNSET",
  "BREAKFAST",
  "CUSTOM",
]);

export const ScheduleSchema = z.object({
  /** Validated as a real IST day here, so the procedures need no date prologue. */
  ScheduleDate: istDayKeySchema,
});

/**
 * An admin's explicit departure/return for one schedule, as minutes from IST
 * midnight — the value a `<input type="time">` produces.
 *
 * This replaced a `{hours, min, Cycle}` object that the server re-joined into
 * the string `"4:30:PM"` nine lines later, and then validated with a stricter
 * pattern than the one that parsed it, so a 1–9 o'clock time was accepted by
 * one procedure and rejected by the other.
 *
 * `nullish` because both are genuinely optional: omitted means "inherit the
 * package's time", which is what every AVAILABLE schedule does.
 */
const overrideMinutes = {
  overrideStartMinutes: istMinutesSchema.nullish(),
  overrideEndMinutes: istMinutesSchema.nullish(),
};

export const UpdatedDateScheduleSchema = z.object({
  ...overrideMinutes,
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
  ...overrideMinutes,
});

export type TScheduleSchema = z.infer<typeof ScheduleSchema>;
export type TScheduleCreateSchema = z.infer<typeof ScheduleCreateSchema>;
