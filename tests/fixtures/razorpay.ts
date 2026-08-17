/**
 * `order.paid` webhook payloads, shaped exactly like the real thing.
 *
 * The `notes` are never hand-written: they come from the production `getNotes`,
 * or straight out of the order the tRPC procedure just created. That matters
 * because `notes` is the entire contract between order creation and the webhook
 * — it is where the booking lives between the customer paying and the row
 * existing — and Razorpay silently caps it at 15 keys. A hand-rolled fixture
 * would drift from that contract without anything noticing.
 */
import type {
  OrderPaidWebhookEvent,
  PaymentEntity,
} from "@/app/api/webhook/v2/razorpay/razer-pay-order-paid.types";

let seq = 0;

export function orderPaidEvent(args: {
  notes: Record<string, unknown>;
  /** Paise. Defaults to a round ₹1000. */
  amountPaid?: number;
  orderId?: string;
  paymentId?: string;
  email?: string;
  contact?: string;
}): OrderPaidWebhookEvent {
  seq += 1;
  const amount = args.amountPaid ?? 100_000;
  const orderId = args.orderId ?? `order_TEST${String(seq).padStart(10, "0")}`;
  const paymentId = args.paymentId ?? `pay_TEST${String(seq).padStart(10, "0")}`;
  const createdAt = 1_755_000_000 + seq;

  const payment: PaymentEntity = {
    id: paymentId,
    entity: "payment",
    amount,
    currency: "INR",
    status: "captured",
    order_id: orderId,
    invoice_id: null,
    international: false,
    method: "upi",
    amount_refunded: 0,
    refund_status: null,
    captured: true,
    description: null,
    card_id: null,
    bank: null,
    wallet: null,
    vpa: "customer@upi",
    email: args.email ?? "customer@test.invalid",
    contact: args.contact ?? "+919876543210",
    notes: args.notes,
    fee: 0,
    tax: 0,
    error_code: null,
    error_description: null,
    created_at: createdAt,
  };

  return {
    entity: "event",
    account_id: "acc_TEST00000000",
    event: "order.paid",
    contains: ["payment", "order"],
    created_at: createdAt,
    payload: {
      payment: { entity: payment },
      order: {
        entity: {
          id: orderId,
          entity: "order",
          amount,
          amount_paid: amount,
          amount_due: 0,
          currency: "INR",
          receipt: "",
          offer_id: null,
          status: "paid",
          attempts: 1,
          notes: args.notes,
          created_at: createdAt,
        },
      },
    },
  };
}

/** A distinct `x-razorpay-event-id` per call, so tests opt in to collisions. */
export function newEventId(prefix = "evt") {
  seq += 1;
  return `${prefix}_TEST${String(seq).padStart(10, "0")}`;
}
