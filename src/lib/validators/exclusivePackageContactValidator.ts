import { z } from "zod";
import { indianPhoneRegex } from "./offlineBookingValidator";

export type TExclusivePackageValidator = z.infer<
  typeof exclusivePackageValidator
>;

export const exclusivePackageValidator = z.object({
  name: z
    .string({ required_error: "Please provide a Name" })
    .min(3, { message: "Name Should be atleast 3 letters" }),
  email: z.string({ required_error: "Please Provide Email" }).email(),
  phone: z
    .string({ required_error: "Please provide a Phone" })
    .min(10, { message: "Min length 10" })
    .refine((num) => num === "" || indianPhoneRegex.test(num), {
      message: "Should be a valid Phone number, only indian number are allowed",
    }),
  Duration: z.string(),
  eventType: z.string().min(3),
  selectedDate: z.string(),
  token: z.string().optional(),
});
