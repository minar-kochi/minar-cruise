import { $Enums } from "@prisma/client";
import { error } from "console";
import { setErrorMap, z } from "zod";
import { isStatusSunset } from "./Schedules";

export type TOnlineBookingFormValidator = z.infer<
  typeof onlineBookingFormValidator
>;

const indianPhoneRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;

const packageCategory = [
  "BREAKFAST",
  "CUSTOM",
  "DINNER",
  "EXCLUSIVE",
  "LUNCH",
  "SUNSET",
] as const;

export const onlineBookingFormValidator = z
  .object({
    name: z
      .string()
      .min(3, "Name should have min 3 letters")
      .max(25, "Name should be maximum of 25 letters"),
    email: z.string().email({
      message: "Please Enter a Valid Email"
    }),
    phone: z
      .string()
      .refine((num) => num === "" || num.length > 0, {
        message: "Phone number must be at least 10 digits long if provided",
      })
      .refine((num) => num === "" || indianPhoneRegex.test(num), {
        message:
          "Please Enter a valid Indian Mobile Number",
      })
      .optional(),
    numOfAdults: z
      .number({ message: "Please provide a valid number" })
      .max(150, "Adult Count cannot exceed 150"),

    numOfChildren: z
      .number({
        message: "Please Enter a valid number",
      })
      .max(120, "Child Count cannot exceed 120"),
    numOfBaby: z
      .number({
        message: "Please Enter a valid number",
      })
      .max(50, "Baby Count cannot exceed 50"),
    packageId: z.string(),
    scheduleId: z.string().optional(),
    selectedScheduleDate: z.string(),
    packageCategory: z.enum(packageCategory),
  })
  .refine(
    (data) => {
      let totalCount = data.numOfAdults + data.numOfChildren;

      if (!data.scheduleId && isStatusSunset(data.packageCategory)) {
        if (totalCount < 1) {
          return false;
        }
        return true;
      }
      if (totalCount < 1) {
        return false;
      }
      return true;
    },
    {
      message: "Please select atleast 1 Seat to proceed",
      path: ["numOfAdults"],
    },
  )
  .refine(
    (data) => {
      let totalCount = data.numOfAdults + data.numOfChildren;
      if (
        !data.scheduleId &&
        totalCount < 25 &&
        !isStatusSunset(data.packageCategory)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Should select at least a total of 25 seats (adult + child)",
      path: ["numOfAdults"],
    },
  )
  .refine(
    (data)=>{
     let totalCount = data.numOfAdults + data.numOfChildren + data.numOfBaby;
     if(totalCount > 150) return false;
     return true 
    },
    {
      message: "Max seats allowed 150",
      path:['numOfAdults']
    }
  )
// .refine(
//   (data) => {
//     let totalCount = data.numOfAdults + data.numOfChildren;
//     if (totalCount >= 1) {
//       return true;
//     }
//     return false;
//   },
//   {
//     message: "Total Count should be atleast greater than one",
//     path: ["numOfAdults"],
//   },
// );

// export type TOnlineBookingFormBackendValidator = z.infer<
//   typeof onlineBookingFormBackendValidator
// >;
// export const onlineBookingFormBackendValidator = z
//   .object({
//     date: z.string(),
//   })
//   .and(onlineBookingFormValidator);
