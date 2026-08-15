import { db } from "@/db";
import {
  BOOKING_CONFIG_SINGLETON_ID,
  getBookingConfigUncached,
} from "@/lib/helpers/config/getBookingConfig";
import { BookingConfigValidator } from "@/lib/validators/BookingConfigValidator";
import { revalidateBookingConfig } from "@/revalidator/site";
import { AdminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

export const bookingConfig = router({
  getBookingConfig: AdminProcedure.query(async () => {
    return await getBookingConfigUncached();
  }),

  updateBookingConfig: AdminProcedure.input(BookingConfigValidator).mutation(
    async ({ input }) => {
      try {
        await db.bookingConfig.upsert({
          where: { id: BOOKING_CONFIG_SINGLETON_ID },
          create: { id: BOOKING_CONFIG_SINGLETON_ID, ...input },
          update: input,
        });

        // Every package that inherits a default embeds it in its prerendered
        // page, so the tag alone would not move the customer-facing gate.
        await revalidateBookingConfig();

        return await getBookingConfigUncached();
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update booking configuration",
        });
      }
    },
  ),
});
