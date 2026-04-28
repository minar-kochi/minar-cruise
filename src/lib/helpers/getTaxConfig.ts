import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { GST_RATE, GST_SAC_CODE, MINAR_GSTIN } from "./gst";

export const TAX_CONFIG_CACHE_TAG = "tax-config";
export const TAX_CONFIG_SINGLETON_ID = "singleton";

export type TaxConfig = {
  gstRate: number;
  sacCode: string;
  gstin: string;
};

const FALLBACK_TAX_CONFIG: TaxConfig = {
  gstRate: GST_RATE,
  sacCode: GST_SAC_CODE,
  gstin: MINAR_GSTIN,
};

export const getTaxConfig = unstable_cache(
  async (): Promise<TaxConfig> => {
    const row = await db.taxConfiguration.findUnique({
      where: { id: TAX_CONFIG_SINGLETON_ID },
      select: { gstRate: true, sacCode: true, gstin: true },
    });
    return row ?? FALLBACK_TAX_CONFIG;
  },
  ["tax-config"],
  { tags: [TAX_CONFIG_CACHE_TAG] },
);
