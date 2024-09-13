import { z } from "zod";
const indianPhoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;

export const ContactValidators = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name is too short",
    })
    .max(15, {
      message: "Maybe shorten the name a bit, Soo i can spell it :)",
    }),
  phone: z
    .string()
    .refine((num) => num === "" || num.length > 0, {
      message: "Phone number must be at least 10 digits long if provided",
    })
    .refine((num) => num === "" || indianPhoneRegex.test(num), {
      message: "Please Enter a valid Indian Mobile Number",
    }),
  email: z.string().email({
    message: "I haven't figured that kinda email",
  }),
  description: z
    .string()
    .min(25, {
      message: "Hey! atleast take a effort! for 25 Charector :)",
    })
    .max(1000, {
      message: "dude! Well explained but its too long!",
    }),
});

export type TContactValidators = z.infer<typeof ContactValidators>;

// data => if subscribe news letter => Keep it database email and name || !description ||

// data !news => send the email. contact@qoop.ro

export const SubscriptionFormValidator = z.object({
  name: z.string().min(3, {
    message: "Min 3 letter req.",
  }),
  email: z.string().email({ message: "Invalid email" }),
});

export type TSubscriptionFormValidator = z.infer<
  typeof SubscriptionFormValidator
>;
