/**
 * A caller for the real tRPC router.
 *
 * The context is `{}` because that is exactly what the HTTP handler builds —
 * `src/app/api/trpc/[trpc]/route.ts` passes `createContext: () => ({})` — so a
 * caller with the same context exercises the same code the browser reaches.
 *
 * reCAPTCHA is a no-op here: `verifyRecaptcha` returns early when
 * RECAPTCHA_SITE_SECRET is unset, and vitest.config.mts deliberately leaves it
 * unset.
 */
import { appRouter } from "@/server/routers";
import type { TOnlineBookingFormValidator } from "@/lib/validators/onlineBookingValidator";

export const caller = appRouter.createCaller({});

/** The public booking form's payload, with test-shaped defaults. */
export function bookingInput(
  overrides: Partial<TOnlineBookingFormValidator> & {
    packageId: string;
    selectedScheduleDate: string;
  },
): TOnlineBookingFormValidator {
  return {
    name: "Test Customer",
    email: "customer@test.invalid",
    phone: "9876543210",
    numOfAdults: 2,
    numOfChildren: 0,
    numOfBaby: 0,
    packageCategory: "BREAKFAST",
    token: null,
    ...overrides,
  } as TOnlineBookingFormValidator;
}
