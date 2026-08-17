/**
 * Order -> payment -> webhook, as one call.
 *
 * This is the seam the whole suite exists for. The public flow writes nothing
 * when the customer submits the form; it creates a Razorpay order whose `notes`
 * are the only record of the intended booking, and the rows appear later when
 * the `order.paid` webhook arrives. Testing either half alone proves very
 * little — the interesting failures live in whether the notes one side wrote are
 * the notes the other side can read.
 *
 * `payFor` therefore takes the notes and amount straight off the recorded
 * `orders.create` call rather than rebuilding them, so nothing here can agree
 * with production by coincidence.
 */
import { razorpayMock } from "../setup/mocks";
import { bookingInput, caller } from "./trpc";
import { newEventId, orderPaidEvent } from "../fixtures/razorpay";
import { postWebhook, type WebhookResult } from "./webhook";
import type { TOnlineBookingFormValidator } from "@/lib/validators/onlineBookingValidator";

export type PaidFlow = {
  /** The notes the tRPC procedure handed Razorpay. */
  notes: Record<string, unknown>;
  /** Paise, GST-inclusive. */
  amount: number;
  /** The pre-generated cuid the webhook uses as the explicit Booking.id. */
  bookingId: string;
  eventId: string;
  event: ReturnType<typeof orderPaidEvent>;
  result: WebhookResult;
};

/** Create an order for `input`, then deliver a signed `order.paid` for it. */
export async function payFor(
  input: Partial<TOnlineBookingFormValidator> & {
    packageId: string;
    selectedScheduleDate: string;
  },
  opts: { eventId?: string } = {},
): Promise<PaidFlow> {
  await caller.user.createRazorPayIntent(bookingInput(input));

  const order = razorpayMock.lastOrderOptions();
  if (!order) throw new Error("createRazorPayIntent did not create an order");

  const notes = order.notes as Record<string, unknown>;
  const eventId = opts.eventId ?? newEventId();
  const event = orderPaidEvent({ notes, amountPaid: order.amount });
  const result = await postWebhook(event, { eventId });

  return {
    notes,
    amount: order.amount,
    bookingId: notes.bookingId as string,
    eventId,
    event,
    result,
  };
}

/** Re-deliver an event that was already sent — same body, same id. */
export function redeliver(flow: PaidFlow): Promise<WebhookResult> {
  return postWebhook(flow.event, { eventId: flow.eventId });
}
