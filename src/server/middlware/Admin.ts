import { middleware } from "../trpc";

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
