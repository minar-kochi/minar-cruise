import { z } from "zod";
import { indianPhoneRegex } from "./offlineBookingValidator";

export type TExclusivePackageValidator = z.infer<typeof exclusivePackageValidator>

export const exclusivePackageValidator = z.object({
  name: z.string().min(3, { message: "Min Length 3" }),
  email: z.string(),
  phone: z
    .string()
    .min(10, { message: "Min length 10" })
    .refine((num) => num === "" || indianPhoneRegex.test(num), {
      message: "Should be a valid Phone number, only indian number are allowed",
    }),
  count: z.number().min(1,{message: "This field cannot be empty"}),
  Duration: z.string(),
  selectedDate: z.string(),
});
