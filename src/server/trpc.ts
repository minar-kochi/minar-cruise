import { auth } from "@/auth/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.

/**
 * superjson is what makes the inferred types TRUE.
 *
 * Without it every `Date` is serialised to an ISO string while TypeScript still
 * infers `Date` — so `schedule.startsAt.getTime()` type-checks and throws at
 * runtime. The codebase used to carry hand-maintained corrections for that lie
 * (`TScheduleDataDayReplaceString`, `DeepReplaceType<T, Date, string>`) which
 * had to be updated by hand for every new Date column, and silently drifted
 * whenever someone forgot.
 *
 * MUST stay in sync with the matching `transformer` on the link in
 * src/context/TrpcProvider.tsx. In tRPC v11 the transformer lives on the LINK,
 * not on `createClient` — the v10 placement is silently ignored, and a mismatch
 * between the two ends fails every request at deserialisation.
 */
const t = initTRPC.create({
  transformer: superjson,
});

export const router = t.router;
// Base router and procedure
export const middleware = t.middleware;

export const preventDevWriteMiddleware = middleware(async (opts) => {
  const RequestType = opts.type === "mutation";
  if (process.env.APP_ENV === "staging" && RequestType) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Wouldn't be able to make changes in staging.",
    });
  }
  return opts.next();
});
export const publicProcedure = t.procedure

/**
 * @TODO - AMJAD
 * Refactor middlware to avoid Hoisting issues.
 */

export const isAdmin = middleware(async (opts) => {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Please Log-in to continue",
    });
  }

  return opts.next({
    ctx: { AdminUser: session.user },
  });
});

export const AdminProcedure = t.procedure.use(isAdmin);
