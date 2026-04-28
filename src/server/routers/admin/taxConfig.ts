import { db } from "@/db";
import {
  TAX_CONFIG_CACHE_TAG,
  TAX_CONFIG_SINGLETON_ID,
  getTaxConfig,
} from "@/lib/helpers/getTaxConfig";
import { TaxConfigValidator } from "@/lib/validators/TaxConfigValidator";
import { AdminProcedure, publicProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { revalidateTag } from "next/cache";

export const taxConfig = router({
  getTaxConfig: AdminProcedure.query(async () => {
    return await getTaxConfig();
  }),

  getPublicTaxConfig: publicProcedure.query(async () => {
    return await getTaxConfig();
  }),

  updateTaxConfig: AdminProcedure.input(TaxConfigValidator).mutation(
    async ({ input }) => {
      try {
        const data = await db.taxConfiguration.upsert({
          where: { id: TAX_CONFIG_SINGLETON_ID },
          create: { id: TAX_CONFIG_SINGLETON_ID, ...input },
          update: input,
        });
        revalidateTag(TAX_CONFIG_CACHE_TAG);
        return data;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update tax configuration",
        });
      }
    },
  ),
});
