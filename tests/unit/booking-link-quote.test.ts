/**
 * Assertions for `computeBookingLinkQuote`. Ported from
 * scripts/assert-booking-link-quote.ts.
 *
 * The whole-rupee invariant is the important one — a fractional rupee reaching
 * `Payments.totalAmount` / `advancePaid` (both Int) throws inside the order.paid
 * webhook, AFTER the customer's money has been captured.
 */
import { describe, expect, it } from "vitest";
import {
  computeBookingLinkQuote,
  MIN_ORDER_PAISE,
} from "@/lib/helpers/bookingLink/quote";

describe("2 adults + 1 child @ ₹2,500 / ₹1,500, 5% GST, ADVANCE 50%", () => {
  const advance = computeBookingLinkQuote({
    adultPricePaise: 250000,
    childPricePaise: 150000,
    gstRate: 5,
    adultCount: 2,
    childCount: 1,
    paymentType: "ADVANCE",
  });

  it("base = ₹6,500", () => expect(advance.basePaise).toBe(650000));
  it("gst  = ₹325", () => expect(advance.gstPaise).toBe(32500));
  it("full total = ₹6,825", () => expect(advance.fullTotalPaise).toBe(682500));
  it("payable now = ₹3,413", () => expect(advance.payableNowPaise).toBe(341300));
  it("balance = ₹3,412", () => expect(advance.balancePaise).toBe(341200));
});

describe("Same cart, FULL payment", () => {
  const full = computeBookingLinkQuote({
    adultPricePaise: 250000,
    childPricePaise: 150000,
    gstRate: 5,
    adultCount: 2,
    childCount: 1,
    paymentType: "FULL",
  });

  it("payable now == full total", () =>
    expect(full.payableNowPaise).toBe(full.fullTotalPaise));
  it("balance = 0", () => expect(full.balancePaise).toBe(0));
});

describe("Seeded ₹750 package, 1 adult, 5% GST — the fractional-rupee case", () => {
  // The regression that motivated the rounding: the seeded ₹750 breakfast
  // package with one adult produces ₹787.50, which Prisma rejects for an Int.
  const fractional = computeBookingLinkQuote({
    adultPricePaise: 75000,
    childPricePaise: 40000,
    gstRate: 5,
    adultCount: 1,
    childCount: 0,
    paymentType: "FULL",
  });

  it("raw base+gst would be ₹787.50", () => expect(75000 + 3750).toBe(78750));
  it("rounded up to ₹788", () => expect(fractional.fullTotalPaise).toBe(78800));
});

describe("Whole-rupee invariant across a wide sweep", () => {
  const prices = [40000, 50000, 75000, 100000, 150000, 33333];
  const rates = [0, 5, 12, 18];

  // 6 x 6 x 4 x 9 x 9 x 2 = 23,328 combinations. Collected into one assertion
  // rather than 23k `it()`s: the useful output is the list of offenders, not a
  // pass line per combination.
  const offenders: string[] = [];
  let swept = 0;

  for (const adultPricePaise of prices) {
    for (const childPricePaise of prices) {
      for (const gstRate of rates) {
        for (let adultCount = 0; adultCount <= 8; adultCount++) {
          for (let childCount = 0; childCount <= 8; childCount++) {
            for (const paymentType of ["ADVANCE", "FULL"] as const) {
              const q = computeBookingLinkQuote({
                adultPricePaise,
                childPricePaise,
                gstRate,
                adultCount,
                childCount,
                paymentType,
              });
              swept++;
              const where = `${adultPricePaise}/${childPricePaise} @${gstRate}% ${adultCount}a${childCount}c ${paymentType}`;
              if (q.fullTotalPaise % 100 !== 0) {
                offenders.push(`${where}: fullTotalPaise ${q.fullTotalPaise} not whole rupees`);
              }
              if (q.payableNowPaise % 100 !== 0) {
                offenders.push(`${where}: payableNowPaise ${q.payableNowPaise} not whole rupees`);
              }
              if (q.payableNowPaise > q.fullTotalPaise) {
                offenders.push(`${where}: payable ${q.payableNowPaise} > total ${q.fullTotalPaise}`);
              }
              if (q.balancePaise < 0) {
                offenders.push(`${where}: negative balance ${q.balancePaise}`);
              }
            }
          }
        }
      }
    }
  }

  it("sweeps every combination", () => expect(swept).toBe(23_328));
  it("all combinations are whole-rupee and consistent", () =>
    expect(offenders).toEqual([]));
});

describe("Empty cart", () => {
  const empty = computeBookingLinkQuote({
    adultPricePaise: 250000,
    childPricePaise: 150000,
    gstRate: 5,
    adultCount: 0,
    childCount: 0,
    paymentType: "ADVANCE",
  });

  it("full total = 0", () => expect(empty.fullTotalPaise).toBe(0));
  it("below Razorpay minimum", () =>
    expect(empty.payableNowPaise).toBeLessThan(MIN_ORDER_PAISE));
});
