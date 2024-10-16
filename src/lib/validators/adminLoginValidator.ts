import { z } from "zod";

export const AdminLoginValidator = z.object({
  email: z.string().email({ message: "Email is not in valid form" }),
  password: z.string(),
});
export type TAdminLoginValidator = z.infer<typeof AdminLoginValidator>;
