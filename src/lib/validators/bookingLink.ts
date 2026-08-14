import { z } from "zod";
import { indianPhoneRegex } from "./offlineBookingValidator";
import { BOOKING_LINK_TOKEN_REGEX } from "@/lib/helpers/bookingLink/token";

/** Optional free-text field that the admin may simply leave blank. */
const optionalText = (schema: z.ZodString) =>
  schema.optional().or(z.literal(""));

export type TGenerateBookingLink = z.infer<typeof generateBookingLinkSchema>;

export const generateBookingLinkSchema = z.object({
  /**
   * The admin picks an existing schedule from Manage Schedules, so the date and
   * the package always agree. Everything else — packageId, day, prices — is
   * derived from it server-side rather than being re-entered.
   */
  scheduleId: z.string().min(1, "Please choose a schedule"),

  paymentType: z.enum(["ADVANCE", "FULL"], {
    message: "Please choose a payment type",
  }),

  // Everything below is optional — the admin can share a bare link.
  prefillName: optionalText(z.string().max(40, "Max 40 characters")),
  prefillEmail: optionalText(z.string().email("Please enter a valid email")),
  prefillPhone: optionalText(
    z
      .string()
      .regex(indianPhoneRegex, "Please enter a valid Indian mobile number"),
  ),
  prefillAdultCount: z.number().int().min(0).max(150).default(0),
  prefillChildCount: z.number().int().min(0).max(120).default(0),
  prefillBabyCount: z.number().int().min(0).max(50).default(0),

  /** Clamped server-side to the package's operational cut-off. */
  expiryHours: z.number().int().min(1).max(720).default(72),
  /**
   * Let the link book a date that has no schedule yet even when the guest
   * count is under MIN_NEW_BOOKING_COUNT. An admin issuing a link has already
   * authorised the sale over the phone.
   */
  allowBelowMinimum: z.boolean().default(true),
  adminNote: optionalText(z.string().max(280)),
});

export type TBookingLinkToken = z.infer<typeof bookingLinkTokenSchema>;

export const bookingLinkTokenSchema = z.object({
  token: z.string().regex(BOOKING_LINK_TOKEN_REGEX, "Invalid booking link"),
});

export type TBookingLinkCheckout = z.infer<typeof bookingLinkCheckoutSchema>;

export const bookingLinkCheckoutSchema = z
  .object({
    token: z.string().regex(BOOKING_LINK_TOKEN_REGEX, "Invalid booking link"),
    name: z
      .string()
      .min(3, "Name should have min 3 letters")
      .max(40, "Name should be maximum of 40 letters"),
    email: z.string().email("Please enter a valid email"),
    /**
     * Required here, unlike the public form. These bookings start as a phone
     * call, and one without a contact number is useless to the admin.
     */
    phone: z
      .string()
      .regex(indianPhoneRegex, "Please enter a valid Indian mobile number"),
    numOfAdults: z.number().int().min(0).max(150),
    numOfChildren: z.number().int().min(0).max(120),
    numOfBaby: z.number().int().min(0).max(50),
    recaptchaToken: z.string().nullable().optional(),
  })
  .refine((d) => d.numOfAdults + d.numOfChildren >= 1, {
    message: "Please select at least 1 seat to proceed",
    path: ["numOfAdults"],
  })
  .refine((d) => d.numOfAdults + d.numOfChildren + d.numOfBaby <= 150, {
    message: "Max seats allowed 150",
    path: ["numOfAdults"],
  });
