import { z } from "zod";
import { indianPhoneRegex } from "./offlineBookingValidator";

export const exclusivePackageValidator = z.object({
  name: z.string().min(3, { message: "Min Length 3" }),
  email: z.string(),
  phone: z
    .string()
    .min(10, { message: "Min length 10" })
    .refine((num) => num === "" || indianPhoneRegex.test(num), {
      message: "Should be a valid Phone number, only indian number are allowed",
    }),
  adultCount: z
    .number({ message: "Please provide a valid number" })
    .max(150, "Count cannot exceed 150"),

  childCount: z
    .number({
      message: "Please Enter a valid number",
    })
    .max(120, "Count cannot exceed 120"),
  babyCount: z
    .number({
      message: "Please Enter a valid number",
    })
    .max(50, "Count cannot exceed 50"),
  selectedDate: z.string(),
  selectedTime: z.string(),
});
