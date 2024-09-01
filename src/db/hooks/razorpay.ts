import {
  OrderPaidEventError,
  OrderPaidEventErrorCode,
} from "@/class/razorpay/OrderPaidError";
import { getEvents } from "@/lib/helpers/razorpay/utils";
import { Events } from "@prisma/client";
import { handleExistingScheduleOrder } from "./handleExistingScheduleOrder";
import { TOrderEvent } from "@/Types/razorpay/type";
import { NextResponse } from "next/server";
import { handleCreateScheduleOrder } from "./handleCreateScheduleOrder";
import { updateEventToFailed } from "../data/dto/events";
export async function handleOrderPaidEvent({
  events,
  orderBody,
}: TOrderEvent<any>) {
  try {
    console.log(orderBody);
    // orderBody.payload.order.entity
    let event = getEvents(orderBody.payload.order.entity.notes.eventType);
    // let event = "schedule.exists"
    /**
     * Add in check where to send the event to even if the state is to be created check whether the schedule exists,
     * and if the
     * */
    switch (event) {
      case "schedule.create": {
        return await handleCreateScheduleOrder({ events, orderBody });
        break
      }
      case "schedule.existing": {
        console.log("Handing schedule Existing event");
        return await handleExistingScheduleOrder({ events, orderBody });
        break
      }
      case "UNKNOWN": {
        console.log("UNKNOWN ERROR OCCURRED");
        throw new OrderPaidEventError({
          code: "NOT_IMPLIMENTED",
          fatality: {
            fatal: true,
            message: `Some Unknown event Occured is not implimented for order ${orderBody.payload.payment.entity.id} \n Email: ${orderBody.payload.payment.entity.email} \n  Contact: ${orderBody.payload.payment.entity.contact}  `,
          },
        });
      }
    }

  } catch (error) {
    if (error instanceof OrderPaidEventError) {
      if (error.fatal) {
        await updateEventToFailed({
          id: events.id,
          description: error.message,
          failedCountSetter: 6
        });
        return NextResponse.json({ success: false }, { status: 502 });
      }
      await updateEventToFailed({ id: events.id, description: error.message });
      return NextResponse.json({ success: false }, { status: 402 });
    }
    await updateEventToFailed({ id: events.id });
    return NextResponse.json({ success: false }, { status: 406 });
  }
}
