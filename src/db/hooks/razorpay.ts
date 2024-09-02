import {
  OrderPaidEventError,
  OrderPaidEventErrorCode,
} from "@/class/razorpay/OrderPaidError";
import { getEvents } from "@/lib/helpers/razorpay/utils";
import { Events } from "@prisma/client";
import { handleExistingScheduleOrder } from "./handleExistingScheduleOrder";
import {
  TOrderEvent,
  TRazorPayEventsCreateSchedule,
  TRazorPayEventsExistingSchedule,
} from "@/Types/razorpay/type";
import { NextResponse } from "next/server";
import { handleCreateScheduleOrder } from "./handleCreateScheduleOrder";
import { updateEventToFailed } from "../data/dto/events";
import { QueryObj } from "@/server/routers/user/user";
import { db } from "..";
import { findCorrespondingScheduleTimeFromPackageCategory } from "@/lib/Data/manipulators/ScheduleManipulators";
import { getNotes } from "@/lib/razorpay/getNotes";
export async function handleOrderPaidEvent({
  events,
  orderBody,
}: TOrderEvent<any>) {
  try {
    console.log(orderBody);
    const order = orderBody.payload.order.entity;
    // orderBody.payload.order.entity
    let event = getEvents(orderBody.payload.order.entity.notes.eventType);
    let ExistingNotes: TRazorPayEventsExistingSchedule = order.notes;
    let CreateNotes: TRazorPayEventsCreateSchedule = order.notes;

    // let event = "schedule.exists"
    /**
     * check in query object to check whether the schedule already exists or to be created.
     */

    /**
     * Add in check where to send the event to even if the state is to be created check whether the schedule exists,
     * and if the
     * */
    switch (event) {
      case "schedule.create": {
        const { ScheduleTime, packageId, date } =
          order.notes as TRazorPayEventsCreateSchedule;
        const scheduleTimeForPackage =
          findCorrespondingScheduleTimeFromPackageCategory(ScheduleTime);
        if (!scheduleTimeForPackage) {
          throw new OrderPaidEventError({
            code: "SCHEDULE_TIME_NOT_FOUND",
            fatality: {
              message: "Couldn't find corresponding ScheduleTime",
              fatal: true,
            },
          });
        }
        const isScheduleExists = await db.schedule.findFirst({
          where: {
            day: new Date(date),
            schedulePackage: scheduleTimeForPackage,
          },
        });

        if (isScheduleExists?.id) {
        }
      }
    }

    switch (event) {
      case "schedule.create": {
        const { ScheduleTime, packageId, date, eventType, ...rest } =
          order.notes as TRazorPayEventsCreateSchedule;
        const scheduleTimeForPackage =
          findCorrespondingScheduleTimeFromPackageCategory(ScheduleTime);
        if (!scheduleTimeForPackage) {
          throw new OrderPaidEventError({
            code: "SCHEDULE_TIME_NOT_FOUND",
            fatality: {
              message: "Couldn't find corresponding ScheduleTime",
              fatal: true,
            },
          });
        }
        const isScheduleExists = await db.schedule.findFirst({
          where: {
            day: new Date(date),
            schedulePackage: scheduleTimeForPackage,
          },
        });
        if (!isScheduleExists?.id) {
          return await handleCreateScheduleOrder({
            events,
            orderBody,
            notes: CreateNotes,
          });
        }
        if (isScheduleExists.packageId !== packageId) {
          throw new OrderPaidEventError({
            code: "SCHEDULE_TIME_NOT_FOUND",
            fatality: {
              message: `Schedule Creation has conflict with other Package schedule Please review admin dasboard and Razorpay, Email: ${orderBody.payload.payment.entity.email} \n Email: ${orderBody.payload.payment.entity.contact}:`,
              fatal: true,
            },
          });
        }

        const TransformedNotes = getNotes({
          eventType: "schedule.existing",
          scheduleId: isScheduleExists.id,
          packageId: packageId,
          ...rest,
        }) as TRazorPayEventsExistingSchedule;

        return await handleExistingScheduleOrder({
          events,
          orderBody,
          notes: TransformedNotes,
        });
        break;
      }
      case "schedule.existing": {
        console.log("Handing schedule Existing event");
        return await handleExistingScheduleOrder({
          events,
          orderBody,
          notes: ExistingNotes,
        });
        break;
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
          failedCountSetter: 6,
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
