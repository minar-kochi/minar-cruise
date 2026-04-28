import { z } from "zod";

export const TaxConfigValidator = z.object({
  gstRate: z
    .number({ invalid_type_error: "GST rate must be a number" })
    .min(0, { message: "GST rate cannot be negative" })
    .max(100, { message: "GST rate cannot exceed 100" }),
  sacCode: z
    .string()
    .regex(/^\d{6}$/, { message: "SAC code must be 6 digits" }),
  gstin: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      { message: "Invalid GSTIN format" },
    ),
});

export type TTaxConfigValidator = z.infer<typeof TaxConfigValidator>;
