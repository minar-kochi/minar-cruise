import { getEventById, updateEventToFailed } from "@/db/data/dto/events";
import { generateSignature } from "@/lib/helpers/signature";
import { Events } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { processEvent } from "./existing-event";
import { RazorpayWebhookEvent } from "./razer-pay.types";
import { handleOrderPaid } from "./handle-order";
import { OrderPaidEventError } from "@/class/razorpay/OrderPaidError";
import { handleErrorEmail } from "./handle-error-email";
import { MAX_EVENT_RETRY_WEBHOOK_COUNT } from "@/constants/config";
import { sendUnprocessableEventEmail } from "./send-unprocessable-event-email";
import { sendConfirmationEmail } from "@/lib/helpers/resend";
const { RAZORPAY_WEBHOOK_SECRET } = process.env;
if (!RAZORPAY_WEBHOOK_SECRET) {
  throw new Error("Please Define RAZORPAY_WEBHOOK_SECRET");
}

export async function POST(request: NextRequest, res: NextResponse) {
  try {
    const header = headers();
    // get razorpay signature
    const IncommingSignature = header.get("X-Razorpay-Signature");
    // get razorpay eventId as idempotency key.
    const eventId = header.get("x-razorpay-event-id");

    // check if both exists in first or return as invalid request.
    if (!IncommingSignature || !eventId) {
      return NextResponse.json({ success: false }, { status: 200 });
    }
    let body = (await request.json()) as RazorpayWebhookEvent;
    console.log("EVENT REACHED!", body);
    /// calculating signature from the body and secret
    const generatedSignature = generateSignature(body);

    // check whether the generated and incomming are same, if so use the body and the body is securely send from razor-pay
    // if (generatedSignature !== IncommingSignature) {
    //   console.log("invalid signature");
    //   return NextResponse.json({ success: false }, { status: 200 });
    // }

    const existingEvent = await getEventById(eventId);

    const payload = body?.payload ?? null;
    const metadata = null;

    const { action, event } = await processEvent({
      eventId,
      event: existingEvent,
      payload,
      metadata,
    });
    console.log("EVENT:", event);

    switch (action) {
      case "SUCCESS": {
        console.log("EVENT _SUCCESS");

        return NextResponse.json({ success: true }, { status: 200 });
      }
      case "EVENT_CREATION_FAILED": {
        // Send admin email notification.
        console.log("EVENT _FAILED");

        return NextResponse.json({ success: false }, { status: 422 });
      }

      case "PROCESSING": {
        console.log("EVENT _PROCESSING");

        return NextResponse.json({ success: true }, { status: 202 });
      }
      case "NEW_EVENT":
      case "RETRY": {
        console.log("EVENT NEW EVENT/RETRY");
        if (body.event === "order.paid") {
          await handleOrderPaid({ payload: body?.payload, event });
        }
        break;
      }
      case "UNPROCESSABLE_CONTENT": {
        console.log("EVENT UNPROCESSABLE CONTENT");
        const notes = body?.payload?.order?.entity?.notes ?? undefined;
        const customerContact = body?.payload?.payment?.entity?.contact;
        const customerEmail = body?.payload?.payment?.entity?.email;
        await sendConfirmationEmail({
          emailSubject: "🚨[MINAR:ERROR]: Unprocessable Event Alert.",
          recipientEmail: [
            process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "",
            process.env.DEV_EMAIL ?? "",
          ],
          emailComponent: sendUnprocessableEventEmail({
            event: event.id,
            razerPayEventId: event.eventId,
            customerContact,
            customerEmail,
            notes,
          }),
        });

        return NextResponse.json({ success: true }, { status: 200 });
        break;
      }
      default: {
        return NextResponse.json({ success: true }, { status: 200 });
      }
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof OrderPaidEventError) {
      if (error?.email && error.emailPayload) {
        await handleErrorEmail({ emailPayload: error.emailPayload });
      }
      if (error.fatal) {
        await updateEventToFailed({
          id: error.eventId,
          description: error.message,
          failedCountSetter: MAX_EVENT_RETRY_WEBHOOK_COUNT + 1,
        });
        return NextResponse.json({ success: false }, { status: 200 });
      }
    }
    return NextResponse.json({ success: false }, { status: 404 });
  }
}
