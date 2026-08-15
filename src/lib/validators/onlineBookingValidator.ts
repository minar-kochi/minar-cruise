import { $Enums } from "@prisma/client";
import { error } from "console";
import { setErrorMap, z } from "zod";
import { isStatusSunset } from "./Schedules";
import { TPackageBookingRule } from "@/lib/config/bookingConfig.types";

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

/**
 * Sanity ceiling for the structural schema only — a guard against absurd input,
 * not the boat's capacity. The real limit is `BookingConfig.maxBoatSeat`, which
 * an admin can raise above the old hardcoded 150; enforcing 150 here would
 * silently veto that.
 */
const ABSOLUTE_MAX_SEATS = 1000;

/**
 * Structural schema — also the tRPC input schema for `createRazorPayIntent`.
 *
 * Deliberately does NOT enforce the party-size minimum or the boat capacity:
 * both are admin-editable now, and a static schema rejecting at the old numbers
 * would block a legitimate booking before the config-aware check in
 * `CreateBookingForCreateSchedule` ever ran. Client forms should build their
 * resolver with `makeOnlineBookingFormValidator(config)` to get those errors
 * inline; the server procedures remain the authority.
 */
export const onlineBookingFormValidator = z
  .object({
    name: z
      .string()
      .min(3, "Name should have min 3 letters")
      .max(25, "Name should be maximum of 25 letters"),
    email: z.string().email({
      message: "Please Enter a Valid Email",
    }),
    phone: z
      .string()
      .refine((num) => num === "" || num.length > 0, {
        message: "Phone number must be at least 10 digits long if provided",
      })
      .refine((num) => num === "" || indianPhoneRegex.test(num), {
        message: "Please Enter a valid Indian Mobile Number",
      })
      .optional(),
    /**
     * `.int().min(0)` on all three is load-bearing, not decoration. The totals
     * below only check the sum, so without a floor `numOfAdults: -1` plus
     * `numOfChildren: 2` reads as a party of one and prices as two child seats
     * minus one adult — a paid booking for ₹50.
     */
    numOfAdults: z
      .number({ message: "Please provide a valid number" })
      .int("Adult Count must be a whole number")
      .min(0, "Adult Count cannot be negative")
      .max(ABSOLUTE_MAX_SEATS, "Adult Count is not valid"),

    numOfChildren: z
      .number({
        message: "Please Enter a valid number",
      })
      .int("Child Count must be a whole number")
      .min(0, "Child Count cannot be negative")
      .max(ABSOLUTE_MAX_SEATS, "Child Count is not valid"),
    numOfBaby: z
      .number({
        message: "Please Enter a valid number",
      })
      .int("Baby Count must be a whole number")
      .min(0, "Baby Count cannot be negative")
      .max(ABSOLUTE_MAX_SEATS, "Baby Count is not valid"),
    packageId: z.string(),
    scheduleId: z.string().optional(),
    selectedScheduleDate: z.string(),
    packageCategory: z.enum(packageCategory),
    token: z.string().nullable().optional(),
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
      let totalCount = data.numOfAdults + data.numOfChildren + data.numOfBaby;
      if (totalCount > ABSOLUTE_MAX_SEATS) return false;
      return true;
    },
    {
      message: "That is not a valid number of seats",
      path: ["numOfAdults"],
    },
  );

/**
 * The booking form schema with this package's rules applied, for use as a
 * client-side `zodResolver`.
 *
 * A package whose rule resolves `minNewBookingCount` to null has no party-size
 * floor at all — that is how Sunset ships, and it replaces the hardcoded
 * `isStatusSunset` exemption this check used to carry.
 *
 * Both rules only bite when there is no existing schedule (`scheduleId`): joining
 * a sailing that is already running has never required the new-schedule minimum.
 */
export function makeOnlineBookingFormValidator(rule: TPackageBookingRule) {
  return onlineBookingFormValidator
    .refine(
      (data) => {
        const totalCount = data.numOfAdults + data.numOfChildren;
        if (data.scheduleId) return true;
        if (rule.minNewBookingCount === null) return true;

        return totalCount >= rule.minNewBookingCount;
      },
      {
        message: `Should select at least a total of ${rule.minNewBookingCount} seats (adult + child)`,
        path: ["numOfAdults"],
      },
    )
    .refine(
      (data) => {
        const totalCount =
          data.numOfAdults + data.numOfChildren + data.numOfBaby;
        return totalCount <= rule.maxBoatSeat;
      },
      {
        message: `Max seats allowed ${rule.maxBoatSeat}`,
        path: ["numOfAdults"],
      },
    );
}
// export const ExtendedOnlineBookingFormWithRecaptcha = onlineBookingFormValidator.
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
