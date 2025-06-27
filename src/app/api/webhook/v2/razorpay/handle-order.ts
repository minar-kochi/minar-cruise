import {
  TRazorPayEventsCreateSchedule,
  TRazorPayEventsExistingSchedule,
} from "@/Types/razorpay/type";
import { OrderPaidEventError } from "@/class/razorpay/OrderPaidError";
import { db } from "@/db";
import { getPackageTimeAndDuration } from "@/db/data/dto/package";
import { findCorrespondingScheduleTimeFromPackageCategory } from "@/lib/Data/manipulators/ScheduleManipulators";
import { getNotes } from "@/lib/razorpay/getNotes";
import { Events } from "@prisma/client";
import { format } from "date-fns";
import { handleCreateScheduleOrder } from "./handle-create-schedule-order";
import { handleExistingScheduleOrder } from "./handle-existing-schedule-order";
import { RazorpayWebhookEvent } from "./razer-pay.types";

type THandleOrderPaid = {
  event: Events;
  payload: RazorpayWebhookEvent["payload"];
};

// This function will throw error OrderPaidEventError
export async function handleOrderPaid({ event, payload }: THandleOrderPaid) {
  const notes: TRazorPayEventsExistingSchedule | TRazorPayEventsCreateSchedule =
    payload.order.entity.notes;
  console.log(notes);
  const payment = payload.payment;
  let packageId = notes.packageId;

  const packageDetail = await getPackageTimeAndDuration(packageId);

  switch (notes.eventType) {
    case "schedule.create": {
      const { ScheduleTime, packageId, date, eventType, ...rest } = notes;
      const scheduleTimeForPackage =
        findCorrespondingScheduleTimeFromPackageCategory(ScheduleTime);

      if (!scheduleTimeForPackage) {
        throw new OrderPaidEventError({
          code: "SCHEDULE_TIME_NOT_FOUND",
          fatality: {
            fatal: true,
            eventId: event.id,
            email: true,
            emailPayload: {
              type: "SCHEDULE_TIME_NOT_FOUND",
              receiver: ["admin"],
              payload: {
                scheduleTime: ScheduleTime,
                packageTitle: packageDetail?.title ?? "",
                date: format(new Date(date), "iii dd-MM-yyyy"),
                adultCount: `${rest?.adultCount}`,
                babyCount: `${rest?.babyCount}`,
                childCount: `${rest?.childCount}`,
                email: rest?.email,
                name: rest?.name,
                contact: payment.entity.contact,
                RazerPayEventId: event.eventId,
                eventId: event.id,
              },
            },
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
        await handleCreateScheduleOrder({
          event: event,
          payload,
          notes: notes,
          packageDetail,
        });
        return;
      }

      if (isScheduleExists.packageId !== packageId) {
        throw new OrderPaidEventError({
          code: "SCHEDULE_PACKAGE_CONFLICTS",
          fatality: {
            eventId: event.id,
            fatal: true,
            message:
              "A package has been already chosen which, and cannot be processed further",
            email: true,
            emailPayload: {
              type: "SCHEDULE_PACKAGE_CONFLICTS",
              receiver: ["admin"],
              payload: {
                scheduleTime: ScheduleTime,
                packageTitle: packageDetail?.title ?? "N/A",
                date: format(new Date(date), "iii dd-MM-yyyy"),
                adultCount: `${rest?.adultCount}`,
                babyCount: `${rest?.babyCount}`,
                childCount: `${rest?.childCount}`,
                email: rest?.email,
                name: rest?.name,
                contact: payment.entity.contact,
                RazerPayEventId: event.eventId,
                eventId: event.id,
                conflictedPackageTitle: isScheduleExists.Package?.title ?? "",
              },
            },
          },
        });
      }

      const TransformedNotes = getNotes({
        eventType: "schedule.existing",
        scheduleId: isScheduleExists.id,
        packageId: packageId,
        scheduledDate: date,
        ...rest,
      }) as TRazorPayEventsExistingSchedule;

      await handleExistingScheduleOrder({
        event: event,
        payload,
        notes: TransformedNotes,
        packageDetail,
      });
      break;
    }

    case "schedule.existing": {
      await handleExistingScheduleOrder({
        event: event,
        payload,
        notes: notes,
        packageDetail,
      });
      break;
    }

    default: {
      console.log('DEFAULT_CASE_RAN!')
      throw new OrderPaidEventError({
        code: "UNKNOWN_NOTES_EVENT",
        fatality: {
          eventId: event.id,
          fatal: true,
          message: "Failed to recieve the order paid event notes.",
          emailPayload: {
            receiver: ["admin", "dev", "system"],
            type: "UNKNOWN_NOTES_EVENT",
            payload: {
              eventFailedCount: event.FailedCount,
              eventId: event.id,
              paymentEntity: payload.payment.entity,
            },
          },
        },
      });
    }
  }
}
