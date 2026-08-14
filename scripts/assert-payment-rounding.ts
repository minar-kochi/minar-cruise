/**
 * Proves the fractional-rupee bug and its fix against the real database.
 *
 *   docker exec --user node -w /workspace/minar-cruise minar-dev \
 *     npx tsx --require ./scripts/_stub-server-only.cjs \
 *     scripts/assert-payment-rounding.ts
 *
 * The bug is NOT a thrown error, as first assumed. Prisma silently truncates a
 * fractional rupee toward zero before it reaches the `integer` column, so a
 * customer who pays ₹787.50 is recorded as having paid ₹787. Money quietly
 * disappears from the books.
 *
 * Every write happens inside a transaction that is deliberately rolled back, so
 * this leaves no rows behind.
 */
import { db } from "../src/db";
import { buildPaymentCreateInput } from "../src/lib/helpers/razorpay/buildPaymentCreateInput";
import { TaxConfig } from "../src/lib/helpers/getTaxConfig";

/** getTaxConfig() is unstable_cache'd and unusable outside a Next request. */
const TAX_CONFIG: TaxConfig = {
  gstRate: 5,
  sacCode: "998555",
  gstin: "32BSTPK7128K2Z8",
};

const ROLLBACK = "__rollback__";

type TxClient = Parameters<Parameters<typeof db.$transaction>[0]>[0];

/** Run `fn` inside a transaction that always rolls back. */
async function inRollback<T>(fn: (tx: TxClient) => Promise<T>): Promise<T> {
  let out!: T;
  try {
    await db.$transaction(async (tx) => {
      out = await fn(tx);
      throw new Error(ROLLBACK);
    });
  } catch (e: any) {
    if (e?.message !== ROLLBACK) throw e;
  }
  return out;
}

let failures = 0;
function check(label: string, ok: boolean, detail = "") {
  if (!ok) failures++;
  console.log(`${ok ? "  ok  " : " FAIL "} ${label}${detail ? ` — ${detail}` : ""}`);
}

(async () => {
  // The exact cart that used to break: seeded ₹750 package, 1 adult, 5% GST.
  const AMOUNT_PAID_PAISE = 78750; // ₹787.50

  // ---- 1. the OLD behaviour silently loses money --------------------------
  console.log("\n1. Old behaviour: writing order.amount_paid / 100 directly");
  const truncated = await inRollback((tx) =>
    tx.payments.create({
      data: {
        advancePaid: 0,
        discount: 0,
        totalAmount: AMOUNT_PAID_PAISE / 100, // 787.5
        baseAmount: 750,
        gstRate: 5,
        gstAmount: 37.5,
        modeOfPayment: "ONLINE",
      },
    }),
  );
  check(
    "₹787.50 paid is silently stored as ₹787",
    truncated.totalAmount === 787,
    `stored totalAmount = ${truncated.totalAmount}`,
  );
  check(
    "the GST component is truncated too",
    truncated.gstAmount === 37,
    `stored gstAmount = ${truncated.gstAmount} (₹37.50 paid)`,
  );

  // ---- 2. the NEW helper must produce writable integers -------------------
  console.log("\n2. New behaviour: buildPaymentCreateInput (public flow)");
  const input = await buildPaymentCreateInput({
    amountPaidPaise: AMOUNT_PAID_PAISE,
    taxConfig: TAX_CONFIG,
  });
  console.log("     ", JSON.stringify(input));
  check("totalAmount is an integer", Number.isInteger(input.totalAmount), `${input.totalAmount}`);
  check("baseAmount is an integer", Number.isInteger(input.baseAmount), `${input.baseAmount}`);
  check("gstAmount is an integer", Number.isInteger(input.gstAmount), `${input.gstAmount}`);
  check("advancePaid is 0 (public flow)", input.advancePaid === 0);

  const written = await inRollback((tx) => tx.payments.create({ data: input }));
  check(
    "stored value round-trips exactly (no truncation)",
    written.totalAmount === input.totalAmount,
    `stored ${written.totalAmount}, built ${input.totalAmount}`,
  );

  // ---- 3. the advance split ----------------------------------------------
  console.log("\n3. Booking-link ADVANCE: captured ₹3,413 of a ₹6,825 booking");
  const advanceInput = await buildPaymentCreateInput({
    amountPaidPaise: 341300,
    bookingLink: { quotedTotalPaise: 682500, gstRate: 5 },
    taxConfig: TAX_CONFIG,
  });
  console.log("     ", JSON.stringify(advanceInput));
  check("advancePaid = 3413 (collected online)", advanceInput.advancePaid === 3413);
  check("totalAmount = 6825 (full booking)", advanceInput.totalAmount === 6825);
  check(
    "balance due = 3412",
    (advanceInput.totalAmount as number) - (advanceInput.advancePaid as number) === 3412,
  );
  const writtenAdvance = await inRollback((tx) =>
    tx.payments.create({ data: advanceInput }),
  );
  check("Prisma accepts the advance write", !!writtenAdvance?.id);

  // ---- 4. nothing persisted ----------------------------------------------
  const remaining = await db.payments.count();
  check("no rows left behind", remaining === 0, `Payments rows = ${remaining}`);

  await db.$disconnect();
  console.log(
    failures === 0
      ? "\nAll payment-rounding assertions passed.\n"
      : `\n${failures} assertion(s) FAILED.\n`,
  );
  process.exit(failures === 0 ? 0 : 1);
})();
