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
import { getPackageTimeAndDuration } from "../data/dto/package";
import { SendMessageViaWhatsapp } from "@/lib/helpers/whatsapp";
import {
  getInvalidScheduleTemplateWhatsApp,
  SendAdminPackageConflictError,
} from "@/lib/helpers/retrieveWhatsAppMessage";
/**
 * @TODO
 * Order paid
 * client email : [done]
 * admin Email : [done]
 * client whatsapp : [done]
 * admin whatsapp : [done]
 */
export async function handleOrderPaidEvent({
  events,
  orderBody,
}: TOrderEvent<any>) {
  try {
    const order = orderBody.payload.order.entity;

    let event = getEvents(orderBody.payload.order.entity.notes.eventType);
    let ExistingNotes: TRazorPayEventsExistingSchedule = order.notes;
    let CreateNotes: TRazorPayEventsCreateSchedule = order.notes;
    let packageIds = ExistingNotes.packageId;

  

    const packageDetails = await getPackageTimeAndDuration(packageIds);
    switch (event) {
      case "schedule.create": {
        const { ScheduleTime, packageId, date, eventType, ...rest } =
          order.notes as TRazorPayEventsCreateSchedule;

        const scheduleTimeForPackage =
          findCorrespondingScheduleTimeFromPackageCategory(ScheduleTime);

        if (!scheduleTimeForPackage) {
          let message = getInvalidScheduleTemplateWhatsApp({
            ScheduleTime,
            packageTitle: packageDetails?.title ?? "",
            date,
            adultCount: `${rest.adultCount}`,
            babyCount: `${rest.babyCount}`,
            childCount: `${rest.childCount}`,
            email: rest.email,
            name: rest.name,
          });
          throw new OrderPaidEventError({
            code: "SCHEDULE_TIME_NOT_FOUND",
            fatality: {
              message: message,
              fatal: true,
            },
          });
        }

        const isScheduleExists = await db.schedule.findFirst({
          where: {
            day: new Date(date),
            schedulePackage: scheduleTimeForPackage,
          },
          select: {
            id: true,
            packageId: true,
            Package: {
              select: {
                title: true,
              },
            },
          },
        });
        if (!isScheduleExists?.id) {
          return await handleCreateScheduleOrder({
            events,
            orderBody,
            notes: CreateNotes,
            packageDetails,
          });
        }
        if (isScheduleExists.packageId !== packageId) {
          throw new OrderPaidEventError({
            code: "SCHEDULE_TIME_NOT_FOUND",
            fatality: {
              message: SendAdminPackageConflictError({
                ExistPackage: `${isScheduleExists?.packageId}`,
                ReqPackageId: packageId,
                contact:
                  orderBody?.payload?.payment?.entity?.contact ?? rest.name,
                email: rest.email,
                payId: `${orderBody?.payload?.payment?.entity?.id}`,
              }),
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
          packageDetails,
        });
        break;
      }
      case "schedule.existing": {
        console.log("Handing schedule Existing event");
        return await handleExistingScheduleOrder({
          events,
          orderBody,
          notes: ExistingNotes,
          packageDetails,
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
      console.log("FATAL ERROR HAPPENDED");
      if (error.fatal) {
        console.log(error.message);
        await SendMessageViaWhatsapp({
          recipientNumber: process.env.WHATS_APP_CONTACT!,
          message: error.message,
          error: true,
        });
        await updateEventToFailed({
          id: events.id,
          description: error.message,
          failedCountSetter: 6,
        });
        // FATAL ERROR DON'T TRY AGAIN NO POINT
        return NextResponse.json({ success: false }, { status: 200 });
      }
      // NOT FATAL, Could be Tried again
      await updateEventToFailed({ id: events.id, description: error.message });
      // TRY AGAIN.
      return NextResponse.json({ success: false }, { status: 402 });
    }
    await updateEventToFailed({ id: events.id });
    // TRY AGAIN.
    return NextResponse.json({ success: false }, { status: 406 });
  }
}
