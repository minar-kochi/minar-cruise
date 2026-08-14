import "server-only";
import { calculateGSTFromInclusive } from "@/lib/helpers/gst";
import { getTaxConfig, TaxConfig } from "@/lib/helpers/getTaxConfig";
import { paiseToRupees } from "@/lib/helpers/bookingLink/quote";
import { Prisma } from "@prisma/client";

/**
 * Build the `payment: { create: … }` input for a booking created by the
 * order.paid webhook.
 *
 * Extracted from the two identical inline copies in
 * handle-existing-schedule-order.ts and handle-create-schedule-order.ts so the
 * advance/full split lives in exactly one place.
 *
 * ## Why the rounding matters
 * Payments.totalAmount / advancePaid / baseAmount / gstAmount are `integer`
 * columns holding RUPEES, but the callers previously wrote
 * `order.amount_paid / 100` directly. The seeded ₹750 package with one adult
 * and 5% GST produces 78750 paise → 787.5.
 *
 * Prisma does NOT reject that. It silently TRUNCATES toward zero before the
 * value reaches Postgres — 787.5 and even 787.6 both store as 787 (verified
 * against the dev database in scripts/assert-payment-rounding.ts). So the
 * customer pays ₹787.50 and the books record ₹787: a quiet under-recording of
 * revenue, and a GST breakdown derived from a fractional rupee. Roughly half of
 * all real carts hit it, and a 50% advance makes half-rupees the norm.
 *
 * Every amount is now forced through `paiseToRupees` (Math.round), and booking
 * links additionally round their grand total UP to a whole rupee at quote time
 * so the Razorpay order amount is always a multiple of 100 paise — which makes
 * this rounding a no-op for them and keeps paid == recorded exactly.
 */

export type TBookingLinkPaymentContext = {
  /** GST-inclusive value of the whole booking, in paise. */
  quotedTotalPaise: number;
  /** The rate snapshotted on the link, not the live TaxConfiguration. */
  gstRate: number;
};

export async function buildPaymentCreateInput({
  amountPaidPaise,
  bookingLink,
  taxConfig: taxConfigOverride,
}: {
  /** `payload.order.entity.amount_paid` — what Razorpay actually captured. */
  amountPaidPaise: number;
  /** null for the public /search and /package flows. */
  bookingLink?: TBookingLinkPaymentContext | null;
  /**
   * Injection point for the assertion scripts. `getTaxConfig` is wrapped in
   * `unstable_cache`, which throws outside a Next request context, so a plain
   * tsx script cannot call this function without supplying its own config.
   */
  taxConfig?: TaxConfig;
}): Promise<Prisma.PaymentsCreateWithoutBookingInput> {
  const taxConfig = taxConfigOverride ?? (await getTaxConfig());
  const paidRupees = paiseToRupees(amountPaidPaise);

  if (!bookingLink) {
    /**
     * Public flow — unchanged semantics: the customer always pays in full, so
     * the captured amount IS the booking total and nothing is outstanding.
     * `advancePaid: 0` is what every existing row holds; downstream code reads
     * a zero here as "no balance due".
     */
    const gst = calculateGSTFromInclusive(paidRupees, taxConfig.gstRate);
    return {
      advancePaid: 0,
      discount: 0,
      totalAmount: paidRupees,
      baseAmount: gst.baseAmount,
      gstRate: gst.gstRate,
      gstAmount: gst.gstAmount,
      gstin: taxConfig.gstin,
      sacCode: taxConfig.sacCode,
      modeOfPayment: "ONLINE",
    };
  }

  /**
   * Booking link — the captured amount may be only the advance. GST is
   * computed on the FULL invoice value, because the offline remainder is part
   * of the same taxable supply.
   */
  const fullRupees = paiseToRupees(bookingLink.quotedTotalPaise);
  const gst = calculateGSTFromInclusive(fullRupees, bookingLink.gstRate);

  return {
    advancePaid: paidRupees,
    discount: 0,
    totalAmount: fullRupees,
    baseAmount: gst.baseAmount,
    gstRate: gst.gstRate,
    gstAmount: gst.gstAmount,
    gstin: taxConfig.gstin,
    sacCode: taxConfig.sacCode,
    modeOfPayment: "ONLINE",
  };
}
