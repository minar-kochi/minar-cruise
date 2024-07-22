import { z } from "zod";

export const searchValidator = z.object({
  packageId: z.string(),
  date: z.union([
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
  adultCount: z.number(),
  childCount: z.number(),
  babyCount: z.number(),
});

export type TSearchValidator = z.infer<typeof searchValidator> 