import { z } from "zod";

export const SiteConfigValidator = z.object({
  siteName: z
    .string()
    .min(2, { message: "Site name should have at least 2 characters" })
    .max(80, { message: "Site name cannot exceed 80 characters" }),
  metaTitle: z
    .string()
    .min(10, { message: "Meta title should have at least 10 characters" })
    .max(160, {
      message: "Meta title cannot exceed 160 characters — Google truncates it",
    }),
  metaDescription: z
    .string()
    .min(50, {
      message: "Meta description should have at least 50 characters",
    })
    .max(320, { message: "Meta description cannot exceed 320 characters" }),
  keywords: z.array(z.string().min(2)).max(60, {
    message: "That is more keywords than is useful",
  }),
  ogImage: z
    .string()
    .min(1, { message: "Social share image is required" })
    .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), {
      message: "Must be a site path like /thumbnail.jpg or a full URL",
    }),
  bookingNumbers: z.array(z.string().min(6)).max(10, {
    message: "At most 10 booking numbers",
  }),
  contactEmail: z
    .string()
    .email({ message: "Please enter a valid email" })
    .nullable(),
});

export type TSiteConfigValidator = z.infer<typeof SiteConfigValidator>;
