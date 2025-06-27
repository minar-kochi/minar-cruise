import { $Enums, Events, Schedule } from "@prisma/client";
import { OrderPaidEventPayload } from "./razer-pay-order-paid.types";
import { TRazorPayEventsCreateSchedule } from "@/Types/razorpay/type";
import { TGetPackageTimeAndDuration } from "@/db/data/dto/package";
import { findCorrespondingScheduleTimeFromPackageCategory } from "@/lib/Data/manipulators/ScheduleManipulators";
import { OrderPaidEventError } from "@/class/razorpay/OrderPaidError";
import { getInvalidScheduleTemplateWhatsApp } from "@/lib/helpers/retrieveWhatsAppMessage";
import { db } from "@/db";
import { getDescription } from "@/lib/helpers/razorpay/utils";
import { sendConfirmationEmail } from "@/lib/helpers/resend";
import EmailSendBookingConfirmation from "@/components/services/EmailService";
import { format } from "date-fns";
import { executeTransactionWithRetry } from "./retry-utility";
import { RemoveTimeStampFromDate } from "@/lib/utils";
import { BookingConfirmationEmailForAdmin } from "@/components/services/BookingConfirmationEmailForAdmin";
import { MAX_EVENT_RETRY_WEBHOOK_COUNT } from "@/constants/config";

type THandleCreateScheduleOrder = {
  event: Events;
  payload: OrderPaidEventPayload;
  notes: TRazorPayEventsCreateSchedule;
  packageDetail: TGetPackageTimeAndDuration | null;
};

export async function handleCreateScheduleOrder({
  payload,
  event,
  notes,
  packageDetail,
}: THandleCreateScheduleOrder) {
  const order = payload?.order?.entity;
  const paymentEntity = payload?.payment?.entity;
  const {
    adultCount,
    babyCount,
    childCount,
    email,
    name,
    packageId,
    ScheduleTime,
    Mode,
    date,
    userId,
  } = notes;

  const scheduleTimeForPackage =
    findCorrespondingScheduleTimeFromPackageCategory(ScheduleTime);

  // This error wont throw unless Sender route messed up anything. ;)
  if (!scheduleTimeForPackage) {
    throw new OrderPaidEventError({
      code: "SCHEDULE_TIME_NOT_FOUND",
      fatality: {
        fatal: true,
        email: true,
        eventId: event.id,
        emailPayload: {
          type: "SCHEDULE_TIME_NOT_FOUND",
          receiver: ["admin", "booking"],
          payload: {
            scheduleTime: ScheduleTime,
            packageTitle: packageDetail?.title ?? "",
            date,
            adultCount: `${adultCount}`,
            babyCount: `${babyCount}`,
            childCount: `${childCount}`,
            email: email,
            name: name,
            contact: paymentEntity?.contact,
            RazerPayEventId: event.eventId,
            eventId: event.id,
          },
        },
      },
    });
  }

  try {
    const { booking, schedule } = await executeTransactionWithRetry(
      async () => {
        return await db.$transaction(
          async (tx) => {
            const schedule = await tx.schedule.create({
              data: {
                day: new Date(date),
                schedulePackage: scheduleTimeForPackage,
                scheduleStatus: "AVAILABLE",
                packageId,
              },
            });

            const booking = await tx.booking.create({
              data: {
                numOfAdults: adultCount,
                numOfBaby: babyCount,
                schedule: {
                  connect: {
                    id: schedule.id,
                  },
                },
                numOfChildren: childCount,
                description: getDescription(),
                user: {
                  connectOrCreate: {
                    where: {
                      id: userId,
                    },
                    create: {
                      name,
                      contact: paymentEntity.contact ?? null,
                      email: email,
                    },
                  },
                },
                payment: {
                  create: {
                    advancePaid: 0,
                    discount: 0,
                    // Amount paid received paise: convert by 100 to make to rupee
                    totalAmount: order.amount_paid / 100,
                    modeOfPayment: "ONLINE",
                  },
                },
              },
            });

            const updatedEvent = await tx.events.update({
              where: {
                id: event.id,
              },
              data: {
                bookingId: booking.id,
                status: "SUCCESS",
                metadata: booking,
              },
            });

            return { booking, schedule, updatedEvent };
          },
          {
            // Transaction options
            maxWait: 5000, // 5 seconds max wait for a transaction to start
            timeout: 30000, // 30 seconds max for transaction to complete
          },
        );
      },
      {
        maxRetries: 3,
        baseDelayMs: 1000,
        maxDelayMs: 8000,
        backoffMultiplier: 2,
      },
    );

    let duration = `${packageDetail?.duration ? packageDetail.duration / 60 : "--"} Hr`;

    try {
      await Promise.all([
        // send Email to Client about new booking.
        sendConfirmationEmail({
          recipientEmail: process.env.ADMIN_EMAIL!,
          fromEmail: process.env.NEXT_PUBLIC_BOOKING_EMAIL!,
          emailSubject: "Minar: New Booking Received",
          emailComponent: BookingConfirmationEmailForAdmin({
            scheduleId: schedule.id,
            Name: name,
            adultCount: adultCount,
            babyCount: babyCount,
            BookingDate: format(
              RemoveTimeStampFromDate(booking.createdAt),
              "dd-MM-yyyy",
            ),
            childCount,
            email: email,
            phone: paymentEntity.contact ?? "",
            BookingId: booking.id,
            packageTitle: packageDetail?.title ?? "",
            scheduleDate: format(date, "dd-MM-yyyy"),
            totalAmount: order.amount_paid / 100,
          }),
        }),
        // Send Email to Client
        sendConfirmationEmail({
          recipientEmail: email,
          fromEmail: process.env.NEXT_PUBLIC_BOOKING_EMAIL!,
          emailSubject: "Minar: Your Booking has Confirmed",
          emailComponent: EmailSendBookingConfirmation({
            duration,
            packageTitle: `${packageDetail?.title ?? "-"} `,
            status: "Confirmed",
            totalAmount: order.amount_paid / 100,
            totalCount: adultCount + babyCount + childCount,
            BookingId: booking.id,
            customerName: name,
            date: format(date, "dd-MM-yyyy"),
          }),
        }),
      ]);
    } catch (error) {}
  } catch (error) {
    throw new OrderPaidEventError({
      code: "BOOKING_CREATE_FAILED",
      fatality: {
        email: true,
        eventId: event.id,
        fatal: event.FailedCount > MAX_EVENT_RETRY_WEBHOOK_COUNT,
        message: "Failed to insert booking details",
        emailPayload: {
          type: "FAILED_TO_CREATE_BOOKING",
          receiver: ["admin", "dev"],
          payload: {
            adultCount: `${adultCount}`,
            babyCount: `${babyCount}`,
            childCount: `${childCount}`,
            email,
            name,
            contact: payload?.payment?.entity?.contact,
            date: date ? format(new Date(date), "dd-MM-yyyy") : "",
            eventId: event.id,
            packageTitle: packageDetail?.title ?? "",
            RazerPayEventId: event.eventId,
            scheduleTime: ScheduleTime ?? "",
          },
        },
      },
    });
  }
}
