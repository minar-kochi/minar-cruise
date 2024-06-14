import { z } from "zod";

export const ContactValidators = z.object({
  email: z.string().email({
    message: "I haven't figured that kinda email",
  }),
  isNewsLetter: z.enum(["true", "false"]).default("true"),
  description: z
    .string()
    .min(25, {
      message: "Hey! atleast take a effort! for 25 char :)",
    })
    .max(1000, {
      message: "dude! Well explained but its too long!",
    }),
  firstName: z
    .string()
    .min(3, {
      message: "Your name that short ?",
    })
    .max(15, {
      message: "Maybe shorten a bit, Soo i can spell it :)",
    }),
  lastName: z
    .string()
    .min(2, {
      message: "Too short to be a name dude!",
    })
    .max(15, {
      message: "Maybe shorten a bit, Soo i can spell it :)",
    }),
});

export type TContactValidators = z.infer<typeof ContactValidators>;

// data => if subscribe news letter => Keep it database email and name || !description ||

// data !news => send the email. contact@qoop.ro
