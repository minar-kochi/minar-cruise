// GST Configuration for Minar Cruise.
// Source of truth is the TaxConfiguration row in the database — server code should
// read it via `getTaxConfig()` from "@/lib/helpers/getTaxConfig", and client code
// via the `admin.taxConfig.getPublicTaxConfig` tRPC query.
// The constants below are fallback defaults used only when the DB row is missing
// (e.g. fresh install before the first admin save).

export const GST_RATE = 5.0;
export const GST_SAC_CODE = "998555";
export const MINAR_GSTIN = "32BSTPK7128K2Z8";

export interface GSTBreakdown {
  baseAmount: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
}

/**
 * Calculate GST on top of a base amount (GST-exclusive).
 * All amounts in rupees.
 */
export function calculateGST(
  baseAmountInRupees: number,
  rate: number = GST_RATE,
): GSTBreakdown {
  const gstAmount = Math.round(baseAmountInRupees * (rate / 100));

  return {
    baseAmount: baseAmountInRupees,
    gstRate: rate,
    gstAmount,
    totalAmount: baseAmountInRupees + gstAmount,
  };
}

/**
 * Calculate GST from a base amount in paise (GST-exclusive).
 * Returns breakdown in rupees + totalAmountPaise for Razorpay.
 */
export function calculateGSTPaise(
  baseAmountInPaise: number,
  rate: number = GST_RATE,
): GSTBreakdown & { totalAmountPaise: number } {
  const gstPaise = Math.round(baseAmountInPaise * (rate / 100));
  const totalPaise = baseAmountInPaise + gstPaise;
  const breakdown = calculateGST(baseAmountInPaise / 100, rate);

  return {
    ...breakdown,
    totalAmountPaise: totalPaise,
  };
}

/**
 * Back-calculate GST from a GST-inclusive total (for webhook/storage).
 * Use when you have the total paid amount and need to extract the base + GST.
 */
export function calculateGSTFromInclusive(
  totalAmountInRupees: number,
  rate: number = GST_RATE,
): GSTBreakdown {
  const rateFraction = rate / 100;
  const baseAmount = Math.round(totalAmountInRupees / (1 + rateFraction));
  const gstAmount = totalAmountInRupees - baseAmount;

  return {
    baseAmount,
    gstRate: rate,
    gstAmount,
    totalAmount: totalAmountInRupees,
  };
}
