/**
 * Outbound side effects, stubbed for the whole suite.
 *
 * Both of these are mocked on the assumption that they work. What is under test
 * is everything on our side of them: the arguments we hand Razorpay, and the
 * database rows the webhook writes when Razorpay hands an event back.
 *
 * The mail stub is not merely tidy. `src/lib/helpers/resend.ts` is misnamed —
 * it is nodemailer against smtp.hostinger.com:465 — and `sendNodeMailerEmail`
 * retries twice with exponential backoff. Unmocked, every webhook test would
 * spend three seconds failing to reach an SMTP server.
 *
 * The recorders live inside a single `vi.hoisted` block because `vi.mock` is
 * lifted above the imports, so its factory cannot close over an ordinary
 * module-level binding. Vitest also refuses `export const x = vi.hoisted(...)`
 * directly, hence the unexported holder plus named re-exports below.
 */
import { vi } from "vitest";

const holder = vi.hoisted(() => {
  let seq = 0;

  const ordersCreate = vi.fn(
    async (options: {
      amount: number;
      currency: string;
      payment_capture: number;
      notes: Record<string, string>;
    }) => ({
      id: `order_TEST${String(++seq).padStart(10, "0")}`,
      entity: "order" as const,
      amount: options.amount,
      amount_paid: 0,
      amount_due: options.amount,
      currency: options.currency,
      receipt: null,
      offer_id: null,
      status: "created",
      attempts: 0,
      notes: options.notes,
      created_at: 1_755_000_000,
    }),
  );

  // Argument typed rather than left as () => …, so `mock.calls[0][0]` is a
  // known shape instead of an empty tuple.
  const sendConfirmationEmail = vi.fn(
    async (_args: { emailSubject: string; recipientEmail: string | string[] }) => ({
      messageId: "test",
    }),
  );
  const sendNodeMailerEmail = vi.fn(async (_args: { subject: string }) => ({
    messageId: "test",
  }));

  return { ordersCreate, sendConfirmationEmail, sendNodeMailerEmail };
});

vi.mock("@/lib/helpers/RazorPay", () => ({
  $RazorPay: { orders: { create: holder.ordersCreate } },
  // Re-exported for completeness; the webhook uses @/lib/helpers/signature.
  generateSignature: (data: unknown) => JSON.stringify(data),
}));

vi.mock("@/lib/helpers/resend", () => ({
  sendConfirmationEmail: holder.sendConfirmationEmail,
  sendNodeMailerEmail: holder.sendNodeMailerEmail,
}));

type OrderOptions = {
  amount: number;
  currency: string;
  payment_capture: number;
  notes: Record<string, string>;
};

export const razorpayMock = {
  create: holder.ordersCreate,
  /** The options object passed to the most recent `orders.create`. */
  lastOrderOptions: (): OrderOptions | undefined =>
    holder.ordersCreate.mock.calls.at(-1)?.[0],
  callCount: () => holder.ordersCreate.mock.calls.length,
  reset: () => holder.ordersCreate.mockClear(),
};

export const mailMock = {
  sendConfirmationEmail: holder.sendConfirmationEmail,
  /** Every subject line sent so far, in order. */
  subjects: (): string[] =>
    holder.sendConfirmationEmail.mock.calls.map((c) => c[0]?.emailSubject),
  callCount: () => holder.sendConfirmationEmail.mock.calls.length,
  reset: () => {
    holder.sendConfirmationEmail.mockClear();
    holder.sendNodeMailerEmail.mockClear();
  },
};

/** Clears both recorders. Call from `beforeEach` when asserting on calls. */
export function resetSideEffectMocks() {
  razorpayMock.reset();
  mailMock.reset();
}
