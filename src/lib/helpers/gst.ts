// GST Configuration for Minar Cruise
// SAC Code: 996421 (Inland waterway passenger transport)
// Rate: 5% GST

export const GST_RATE = 5.0;
export const GST_SAC_CODE = "996421";
export const MINAR_GSTIN = "32BSTPK7128K2Z8"; // TODO: Replace with actual GSTIN

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
