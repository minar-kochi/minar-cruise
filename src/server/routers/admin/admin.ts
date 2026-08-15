import { AdminProcedure, router } from "@/server/trpc";
import { booking } from "./booking";
import { bookingLink } from "./bookingLink";
import { schedule } from "./schedule";
import { blog } from "./blog";
import { packages } from "./packages";
import { taxConfig } from "./taxConfig";
import { bookingConfig } from "./bookingConfig";
import { siteConfig } from "./siteConfig";

export const admin = router({
  /**
   * @description
   * String that should be passed in Should be in YYYY-MM-DD
   * if not passed in any then it will get the Current Date and fetch it.
   *
   */
  booking,
  bookingLink,
  blog,
  schedule,
  packages,
  taxConfig,
  bookingConfig,
  siteConfig,
  isAdminTest: AdminProcedure.query(({ ctx: { AdminUser } }) => {
    return AdminUser;
  }),
});
