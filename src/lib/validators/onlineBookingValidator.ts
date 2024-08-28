import { error } from "console";
import { setErrorMap, z } from "zod";

export type TOnlineBookingFormValidator = z.infer<
  typeof onlineBookingFormValidator
>;

const indianPhoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;

export const onlineBookingFormValidator = z
  .object({
    name: z
      .string()
      .min(3, "name should have min 3 letters")
      .max(25, "Name should be maximum of 25 letters"),
    email: z.string().email(),
    phone: z
      .string()
      .refine((num) => num === "" || num.length > 0, {
        message: "Phone number must be at least 3 digits long if provided",
      })
      .refine((num) => num === "" || indianPhoneRegex.test(num), {
        message:
          "Should be a valid Phone number, only indian number are allowed",
      })
      .optional(),
    numOfAdults: z
      .number({ message: "Please provide a valid number" })
      .min(1, "Adult count cannot be less than 1")
      .max(150, "Count cannot exceed 150"),

    numOfChildren: z
      .number({
        message: "Please Enter a valid number",
      })
      .max(120, "Count cannot exceed 120"),
    numOfBaby: z
      .number({
        message: "Please Enter a valid number",
      })
      .max(50, "Count cannot exceed 50"),
    packageId: z.string(),
    scheduleId: z.string().optional(),
    selectedScheduleDate: z.string(),
  })
  .refine(
    (data) => {
      if (!data.scheduleId && data.numOfAdults + data.numOfChildren < 25) {
        return false;
      }
      return true;
    },
    {
      message: "Should select at least a total of 25 seats (adult + child)",
      path: ["numOfAdults"],
    },
  );

// export type TOnlineBookingFormBackendValidator = z.infer<
//   typeof onlineBookingFormBackendValidator
// >;
// export const onlineBookingFormBackendValidator = z
//   .object({
//     date: z.string(),
//   })
//   .and(onlineBookingFormValidator);
