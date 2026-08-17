/**
 * Proves the fractional-rupee bug and its fix against a real database. Ported
 * from scripts/assert-payment-rounding.ts.
 *
 * The bug is NOT a thrown error, as first assumed. Prisma silently truncates a
 * fractional rupee toward zero before it reaches the `integer` column, so a
 * customer who pays ₹787.50 is recorded as having paid ₹787. Money quietly
 * disappears from the books.
 *
 * The original script needed `tsx --require ./scripts/_stub-server-only.cjs`,
 * because `buildPaymentCreateInput` imports "server-only". The vitest alias
 * handles that now, which is why that stub and its one-off invocation are gone.
 *
 * It also ran against the dev database, where the final "no rows left behind"
 * check was permanently red against real data. On a truncated `minar_test` it is
 * a real assertion again.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import { buildPaymentCreateInput } from "@/lib/helpers/razorpay/buildPaymentCreateInput";
import type { TaxConfig } from "@/lib/helpers/getTaxConfig";
import { truncateAll } from "../helpers/db";

const TAX_CONFIG: TaxConfig = {
  gstRate: 5,
  sacCode: "998555",
  gstin: "32BSTPK7128K2Z8",
};

const ROLLBACK = "__rollback__";
type TxClient = Parameters<Parameters<typeof db.$transaction>[0]>[0];

/**
 * Run `fn` inside a transaction that always rolls back.
 *
 * Kept from the original even though the table is now truncated per test: the
 * point of the first case is to write a value Prisma will mangle, and it should
 * never be able to survive the assertion that produced it.
 */
async function inRollback<T>(fn: (tx: TxClient) => Promise<T>): Promise<T> {
  let out!: T;
  try {
    await db.$transaction(async (tx) => {
      out = await fn(tx);
      throw new Error(ROLLBACK);
    });
  } catch (e) {
    if ((e as Error)?.message !== ROLLBACK) throw e;
  }
  return out;
}

// The exact cart that used to break: seeded ₹750 package, 1 adult, 5% GST.
const AMOUNT_PAID_PAISE = 78750; // ₹787.50

beforeEach(async () => {
  await truncateAll();
});

describe("Old behaviour: writing order.amount_paid / 100 directly", () => {
  it("silently stores ₹787.50 as ₹787, and truncates the GST too", async () => {
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

    expect(truncated.totalAmount).toBe(787); // ₹787.50 paid
    expect(truncated.gstAmount).toBe(37); //    ₹37.50 paid
  });
});

describe("New behaviour: buildPaymentCreateInput (public flow)", () => {
  it("produces integers Prisma can store without loss", async () => {
    const input = await buildPaymentCreateInput({
      amountPaidPaise: AMOUNT_PAID_PAISE,
      taxConfig: TAX_CONFIG,
    });

    expect(Number.isInteger(input.totalAmount)).toBe(true);
    expect(Number.isInteger(input.baseAmount)).toBe(true);
    expect(Number.isInteger(input.gstAmount)).toBe(true);
    expect(input.advancePaid).toBe(0); // public flow captures the full amount

    const written = await inRollback((tx) => tx.payments.create({ data: input }));
    expect(written.totalAmount).toBe(input.totalAmount);
  });
});

describe("Booking-link ADVANCE: captured ₹3,413 of a ₹6,825 booking", () => {
  it("splits what was collected from what is owed", async () => {
    const advanceInput = await buildPaymentCreateInput({
      amountPaidPaise: 341300,
      bookingLink: { quotedTotalPaise: 682500, gstRate: 5 },
      taxConfig: TAX_CONFIG,
    });

    expect(advanceInput.advancePaid).toBe(3413); // collected online
    expect(advanceInput.totalAmount).toBe(6825); // full booking
    expect(
      (advanceInput.totalAmount as number) - (advanceInput.advancePaid as number),
    ).toBe(3412); // balance due

    const writtenAdvance = await inRollback((tx) =>
      tx.payments.create({ data: advanceInput }),
    );
    expect(writtenAdvance?.id).toBeTruthy();
  });
});

describe("Nothing persisted", () => {
  it("leaves no Payments rows behind", async () => {
    await buildPaymentCreateInput({
      amountPaidPaise: AMOUNT_PAID_PAISE,
      taxConfig: TAX_CONFIG,
    }).then((input) => inRollback((tx) => tx.payments.create({ data: input })));

    expect(await db.payments.count()).toBe(0);
  });
});
