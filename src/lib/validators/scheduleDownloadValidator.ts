import { z } from "zod";

export const scheduleDateRangeValidator = z.object({
  fromDate: z.string(),
  toDate: z.string(),
  type: z.enum(["scheduleWithBookingCount","scheduleWithoutBookingCount"]),
});

type TScheduleDateRangeValidator = z.infer<typeof scheduleDateRangeValidator>;

