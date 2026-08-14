/**
 * Assertions for computeBookingLinkQuote.
 *
 * The repo has no test runner, so this is a plain tsx script:
 *   docker exec --user node -w /workspace/minar-cruise minar-dev \
 *     npx tsx scripts/assert-booking-link-quote.ts
 *
 * The whole-rupee invariant is the important one — a fractional rupee reaching
 * Payments.totalAmount / advancePaid (both Int) throws inside the order.paid
 * webhook, after the customer's money has been captured.
 */
import {
  computeBookingLinkQuote,
  MIN_ORDER_PAISE,
} from "../src/lib/helpers/bookingLink/quote";

let failures = 0;

function check(label: string, actual: unknown, expected: unknown) {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(
    `${ok ? "  ok  " : " FAIL "} ${label}${ok ? "" : ` — expected ${expected}, got ${actual}`}`,
  );
}

// ---------------------------------------------------------------------------
console.log("\n2 adults + 1 child @ ₹2,500 / ₹1,500, 5% GST, ADVANCE 50%");
const advance = computeBookingLinkQuote({
  adultPricePaise: 250000,
  childPricePaise: 150000,
  gstRate: 5,
  adultCount: 2,
  childCount: 1,
  paymentType: "ADVANCE",
});
check("base = ₹6,500", advance.basePaise, 650000);
check("gst  = ₹325", advance.gstPaise, 32500);
check("full total = ₹6,825", advance.fullTotalPaise, 682500);
check("payable now = ₹3,413", advance.payableNowPaise, 341300);
check("balance = ₹3,412", advance.balancePaise, 341200);

// ---------------------------------------------------------------------------
console.log("\nSame cart, FULL payment");
const full = computeBookingLinkQuote({
  adultPricePaise: 250000,
  childPricePaise: 150000,
  gstRate: 5,
  adultCount: 2,
  childCount: 1,
  paymentType: "FULL",
});
check("payable now == full total", full.payableNowPaise, full.fullTotalPaise);
check("balance = 0", full.balancePaise, 0);

// ---------------------------------------------------------------------------
// The regression that motivated the rounding: the seeded ₹750 breakfast package
// with one adult produces ₹787.50, which Prisma rejects for an Int column.
console.log("\nSeeded ₹750 package, 1 adult, 5% GST — the fractional-rupee case");
const fractional = computeBookingLinkQuote({
  adultPricePaise: 75000,
  childPricePaise: 40000,
  gstRate: 5,
  adultCount: 1,
  childCount: 0,
  paymentType: "FULL",
});
check("raw base+gst would be ₹787.50", 75000 + 3750, 78750);
check("rounded up to ₹788", fractional.fullTotalPaise, 78800);

// ---------------------------------------------------------------------------
console.log("\nWhole-rupee invariant across a wide sweep");
const prices = [40000, 50000, 75000, 100000, 150000, 33333];
const rates = [0, 5, 12, 18];
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
            if (q.fullTotalPaise % 100 !== 0) {
              failures++;
              console.log(` FAIL  fullTotalPaise not whole rupees: ${q.fullTotalPaise}`);
            }
            if (q.payableNowPaise % 100 !== 0) {
              failures++;
              console.log(` FAIL  payableNowPaise not whole rupees: ${q.payableNowPaise}`);
            }
            if (q.payableNowPaise > q.fullTotalPaise) {
              failures++;
              console.log(` FAIL  payable ${q.payableNowPaise} > total ${q.fullTotalPaise}`);
            }
            if (q.balancePaise < 0) {
              failures++;
              console.log(` FAIL  negative balance: ${q.balancePaise}`);
            }
          }
        }
      }
    }
  }
}
check(`all ${swept} combinations whole-rupee and consistent`, failures, 0);

// ---------------------------------------------------------------------------
console.log("\nEmpty cart");
const empty = computeBookingLinkQuote({
  adultPricePaise: 250000,
  childPricePaise: 150000,
  gstRate: 5,
  adultCount: 0,
  childCount: 0,
  paymentType: "ADVANCE",
});
check("full total = 0", empty.fullTotalPaise, 0);
check("below Razorpay minimum", empty.payableNowPaise < MIN_ORDER_PAISE, true);

console.log(
  failures === 0
    ? "\nAll booking-link quote assertions passed.\n"
    : `\n${failures} assertion(s) FAILED.\n`,
);
process.exit(failures === 0 ? 0 : 1);
