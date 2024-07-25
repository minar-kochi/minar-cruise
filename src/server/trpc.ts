import { initTRPC } from "@trpc/server";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
import superjson from 'superjson';

const t = initTRPC.create({
  // transformer: superjson,
  // allowOutsideOfServer: true,
});

export const router = t.router;
// Base router and procedure
export const publicProcedure = t.procedure;

export const middleware = t.middleware;

/**
 * @TODO - AMJAD
 * Refactor middlware to avoid Hoisting issues.
 */

export const isAdmin = middleware(async (opts) => {
  /** @TODO Admin Authorization */

  /** Pass-in Data that is needed for all the admin routes
   * @example
   * role,
   * name, etc...
   */
  return opts.next({
    ctx: {},
  });
});

export const AdminProcedure = t.procedure.use(isAdmin);
