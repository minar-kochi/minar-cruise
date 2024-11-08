import z from "zod";
//Put this into a regix file.

export const indianPhoneRegex =
  /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;

export const offlineBookingFormSchema = z.object({
  name: z.string().min(3, "Name should have min 3 letters").max(40),
  phone: z
    .string()
    .refine((num) => num === "" || num.length > 0, {
      message: "Phone number must be at least 3 digits long if provided",
    })
    .refine((num) => num === "" || indianPhoneRegex.test(num), {
      message: "Should be a valid Phone number, only indian number are allowed",
    })
    .optional(),
  email: z.string().email().or(z.literal("")),
  schedule: z.string(),
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
  discount: z.number({ message: "Please provide a valid prize" }),
  paymentMode: z.string(),
  advanceAmount: z.number({ message: "Please provide number" }),
  billAmount: z.number({ message: "Please provide number" }),
  description: z.string().min(3).max(50),
});

export const updateOfflineBookingSchema = z
  .object({
    bookingId: z.string(),
  })
  .merge(offlineBookingFormSchema)
  .refine(
    (data) => {
      let totalCount = data.adultCount + data.childCount;
      if (totalCount < 1) {
        return false;
      }
      return true;
    },
    {
      message: "Please select atleast 1 Seat to proceed",
      path: ["adultCount"],
    },
  );
export type TUpdateBookingSchema = z.infer<typeof updateOfflineBookingSchema>;
export type TOfflineBookingFormSchema = z.infer<
  typeof offlineBookingFormSchema
>;
