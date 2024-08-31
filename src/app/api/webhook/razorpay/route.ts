import {
  DATABASE_CREATE_RETRY_LOOP_STARTS_FROM,
  MAX_DATABASE_CREATE_RETRY_LOOP,
  MAX_EVENT_RETRY_WEBHOOK_COUNT,
} from "@/constants/config";
import { db } from "@/db";
import {
  createEventorThrow,
  getEventById,
  UpdateFailedCount,
} from "@/db/data/dto/events";
import { handleOrderPaidEvent } from "@/db/hooks/razorpay";
import { $RazorPay } from "@/lib/helpers/RazorPay";
import { generateSignature } from "@/lib/helpers/signature";
import { Events } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
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
      return NextResponse.json({ success: false }, { status: 400 });
    }
    let body = await request.json();

    /// calculating signature from the body and secret
    const generatedSignature = generateSignature(body);

    // check whether the generated and incomming are same, if so use the body and the body is securely send from razor-pay
    if (generatedSignature !== IncommingSignature) {
      // throw a valid error.
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Insert the event into data-base

    // check whether the event is already in database
    let DbEvent = await getEventById(eventId);

    if (DbEvent && DbEvent.id) {
      /**
       *
       * Check the status of DbEvent.
       * if the status is Success return 200.
       * if the status is processing return 400.
       * if the status is Failed then Update The event to be PROCESSING again, and continue the API.
       * mean-while try to notify the admin about the event that has been failed and the status.
       *
       * */
      switch (DbEvent.status) {
        /**
         * Return as 200 Response. and end the loop of webhook
         */
        case "SUCCESS": {
          return NextResponse.json({ success: true }, { status: 200 });
          break;
        }
        /**
         * Failed event.
         * if the event is failed more than 10 times then return the response as 200, and end the event,
         * notify the admin WhatsApp that the event has been failed with appropriate information
         */
        case "FAILED": {
          if (DbEvent.FailedCount > MAX_EVENT_RETRY_WEBHOOK_COUNT) {
            /**
             * @TODO Add whats app pipeline Pipeline for event failed 5 times in a raw.
             */
            return NextResponse.json({ success: true }, { status: 425 });
          }
          // Increase the count and continue through the process
          await UpdateFailedCount(DbEvent.id);
          break;
        }
        /**
         * While Processing the Previous request we can Send back Response as we dont have any news yet to be informed,
         * and mean while to wait for our server to complete the transactions.
         * there might be a place where Processing state might throw error and change to FAILED event.
         * so that it can go to retry loop.
         */
        case "PROCESSING": {
          // No need to do this request awaiting for the current function to be completed.
          return NextResponse.json({ success: true }, { status: 425 });
          break;
        }
      }
    }

    let DbCreateEvent: Events | null;
    // There is no Event as of now, we could either create one
    if (!DbEvent?.id) {
      /**
       * @CREATE_DB_EVENT
       */
      let createEventRetryLoop = DATABASE_CREATE_RETRY_LOOP_STARTS_FROM;
      let createEventFlag = false;
      while (
        createEventRetryLoop <= MAX_DATABASE_CREATE_RETRY_LOOP &&
        !createEventFlag
      ) {
        try {
          DbEvent = await createEventorThrow({
            eventId,
            status: "PROCESSING",
            description: "Razor Pay Event Processing",
          });
          createEventFlag = true;
          continue;
        } catch (error) {
          createEventRetryLoop++;
        }
      }
    }
    if (!DbEvent || DbEvent?.id) {
      /**
       *
       * @TODO Add whats app pipeline Pipeline for event failed
       *  Include Debug for developer ntoes that @CREATE_DB_EVENT failed multiple times.
       *
       */
      return NextResponse.json({ success: true }, { status: 425 });
    }


    
    switch (body.events) {
      case "order.paid": {
        handleOrderPaidEvent({ events: DbEvent, orderBody: body });
        break;
      }
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof TRPCError) {
    }
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
