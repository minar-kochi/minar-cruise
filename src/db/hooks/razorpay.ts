import {
  OrderPaidEventError,
  OrderPaidEventErrorCode,
} from "@/class/razorpay/OrderPaidError";
import { getEvents } from "@/lib/helpers/razorpay/utils";
import { Events } from "@prisma/client";
import { handleExistingScheduleOrder } from "./handleExistingScheduleOrder";
import { TOrderEvent } from "@/Types/razorpay/type";
import { NextResponse } from "next/server";
export async function handleOrderPaidEvent({
  events,
  orderBody,
}: TOrderEvent<any>) {
  console.log(orderBody)
  // orderBody.payload.order.entity
  let event = getEvents(orderBody.payload.order.entity.notes.eventType) 
  // let event = "schedule.exists"
  /**
   * Add in check where to send the event to even if the state is to be created check whether the schedule exists,
   * and if the
   * */
  try {
    switch (event) {
      case "schedule.create": {
        //
        throw new OrderPaidEventError({
          code: "NOT_IMPLIMENTED",
          fatality: {
            fatal: true,
            message: `schedule.create is not implimented for order ${orderBody.payload.payment.entity.id} \n Email: ${orderBody.payload.payment.entity.email} \n Email: ${orderBody.payload.payment.entity.contact}  `,
          },
        });
      }
      case "schedule.exists": {
        console.log("Handing schedule Existing event");
        return await handleExistingScheduleOrder({ events, orderBody });
      }
      case "UNKNOWN": {
        console.log("UNKNOWN ERROR OCCURRED");
        throw new OrderPaidEventError({
          code: "NOT_IMPLIMENTED",
          fatality: {
            fatal: true,
            message: `schedule.create is not implimented for order ${orderBody.payload.payment.entity.id} \n Email: ${orderBody.payload.payment.entity.email} \n Email: ${orderBody.payload.payment.entity.contact}  `,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    if (error instanceof OrderPaidEventError) {
      if (error.fatal) {
        // send in admin Message and get the description about it.
      }
    }
    // Update the event to Failed.
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
