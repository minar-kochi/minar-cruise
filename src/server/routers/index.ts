import ContactMinarEmail from "@/components/services/sendContactEmail";
import {
  sendConfirmationEmail
} from "@/lib/helpers/resend";
import { ContactValidators } from "@/lib/validators/ContactFormValidator";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { publicProcedure, router } from "../trpc";
import { admin } from "./admin/admin";
import { user } from "./user/user";

export const appRouter = router({
  admin,
  user,
  contact: publicProcedure
    .input(ContactValidators)
    .mutation(
      async ({ ctx, input: { description, email, name, phone, token } }) => {
        try {
          if (!token) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Please give access to Recaptcha",
            });
          }
          const formData = `secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${token}`;
          const res = await axios.get(
            `https://www.google.com/recaptcha/api/siteverify?${formData}`,
          );
          if (res && res.data?.success && res.data?.score < 0.5) {
            throw new TRPCError({
              code: "UNPROCESSABLE_CONTENT",
              message: "Recaptcha Failed",
            });
          }
        } catch (error) {
          if (error instanceof TRPCError) {
            throw new TRPCError({ code: error.code, message: error.message });
          }
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Failed to validate Recaptcha Please try again, or contact admin",
          });
        }
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
