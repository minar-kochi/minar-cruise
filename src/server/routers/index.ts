import { ContactValidators } from "@/lib/validators/ContactFormValidator";
import { publicProcedure, router } from "../trpc";
import { admin } from "./admin/admin";
import { user } from "./user/user";
import {
  sendConfirmationEmail,
  sendNodeMailerEmail,
} from "@/lib/helpers/resend";
import ContactMinarEmail from "@/components/services/sendContactEmail";
import { verifyRecaptcha } from "@/lib/helpers/recaptcha";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  admin,
  user,
  contact: publicProcedure
    .input(ContactValidators)
    .mutation(
      async ({ ctx, input: { description, email, name, phone, token } }) => {
        await verifyRecaptcha(token);
        try {
          await sendConfirmationEmail({
            fromEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
            recipientEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL!,
            emailComponent: ContactMinarEmail({
              description,
              email,
              Name: name,
              phone,
            }),
            emailSubject: "Contact Us form From Minar Cruise",
          });
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      },
    ),
});

// export type definition of API
export type AppRouter = typeof appRouter;
