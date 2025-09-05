import { auth } from "@/auth/auth";
import { initTRPC, TRPCError } from "@trpc/server";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.

const t = initTRPC.create({
  // transformer: superjson,
  // allowOutsideOfServer: true,
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
