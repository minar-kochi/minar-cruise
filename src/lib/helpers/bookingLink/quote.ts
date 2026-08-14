import { $Enums } from "@prisma/client";

/**
 * Pricing for admin-generated booking links.
 *
 * Deliberately NOT "server-only": this runs in three places and they must never
 * disagree —
 *   1. the customer page, recalculating live as guest counts change
 *   2. the tRPC order builder, deciding the Razorpay order amount
 *   3. the order.paid webhook, as a fallback when the stored quote is unusable
 *
 * All *input* prices are in PAISE and GST-exclusive, matching Package.adultPrice
 * / Package.childPrice.
 */

export const DEFAULT_ADVANCE_PERCENT = 50;

/** Razorpay rejects orders below ₹1. */
export const MIN_ORDER_PAISE = 100;

export type TBookingLinkQuote = {
  adultSubtotalPaise: number;
  childSubtotalPaise: number;
  /** GST-exclusive fare. */
  basePaise: number;
  gstPaise: number;
  /** GST-inclusive grand total. Always a whole number of rupees. */
  fullTotalPaise: number;
  /** What Razorpay collects now. Always a whole number of rupees. */
  payableNowPaise: number;
  /** Collected offline on the day. */
  balancePaise: number;
};

export type TComputeBookingLinkQuoteArgs = {
  adultPricePaise: number;
  childPricePaise: number;
  gstRate: number;
  adultCount: number;
  childCount: number;
  paymentType: $Enums.BOOKING_LINK_PAYMENT_TYPE;
  advancePercent?: number;
};

/**
 * Babies are never billed anywhere in this codebase — they only count toward
 * the MAX_BOAT_SEAT capacity check.
 */
export function computeBookingLinkQuote({
  adultPricePaise,
  childPricePaise,
  gstRate,
  adultCount,
  childCount,
  paymentType,
  advancePercent = DEFAULT_ADVANCE_PERCENT,
}: TComputeBookingLinkQuoteArgs): TBookingLinkQuote {
  const adultSubtotalPaise = adultPricePaise * adultCount;
  const childSubtotalPaise = childPricePaise * childCount;
  const basePaise = adultSubtotalPaise + childSubtotalPaise;
  const gstPaise = Math.round(basePaise * (gstRate / 100));

  /**
   * Round the grand total UP to a whole rupee.
   *
   * Payments.totalAmount and Payments.advancePaid are Int columns holding
   * rupees, so a fractional rupee makes the webhook's booking write throw
   * *after* Razorpay has already captured the money. Keeping every amount a
   * multiple of 100 paise makes that impossible by construction.
   */
  const fullTotalPaise = roundUpToRupee(basePaise + gstPaise);

  const payableNowPaise =
    paymentType === "FULL"
      ? fullTotalPaise
      : roundUpToRupee((fullTotalPaise * advancePercent) / 100);

  return {
    adultSubtotalPaise,
    childSubtotalPaise,
    basePaise,
    gstPaise,
    fullTotalPaise,
    payableNowPaise,
    balancePaise: fullTotalPaise - payableNowPaise,
  };
}

function roundUpToRupee(paise: number) {
  return Math.ceil(paise / 100) * 100;
}

/** Paise -> rupees, safe for the Int money columns. */
export function paiseToRupees(paise: number) {
  return Math.round(paise / 100);
}
