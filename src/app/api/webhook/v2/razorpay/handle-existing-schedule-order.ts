import { TRazorPayEventsExistingSchedule } from "@/Types/razorpay/type";
import { OrderPaidEventPayload } from "./razer-pay-order-paid.types";
import { $Enums, Events } from "@prisma/client";
import { TGetPackageTimeAndDuration } from "@/db/data/dto/package";
import { db } from "@/db";
import { getDescription } from "@/lib/helpers/razorpay/utils";
import { executeTransactionWithRetry } from "./retry-utility";
import { sendConfirmationEmail } from "@/lib/helpers/resend";
import EmailSendBookingConfirmation, {
  BookingConfirmationEmailForUser,
} from "@/components/services/email/EmailService";
import { format } from "date-fns";
import { sendAdminBookingUpdateNotification } from "@/lib/helpers/WhatsappmessageTemplate/sucess";
import { SendMessageViaWhatsapp } from "@/lib/helpers/whatsapp";
import { BookingConfirmationEmailForAdmin } from "@/components/services/BookingConfirmationEmailForAdmin";
import { RemoveTimeStampFromDate } from "@/lib/utils";
import { OrderPaidEventError } from "@/class/razorpay/OrderPaidError";
import { MAX_EVENT_RETRY_WEBHOOK_COUNT } from "@/constants/config";

type THandleCreateScheduleOrder = {
  event: Events;
  payload: OrderPaidEventPayload;
  notes: TRazorPayEventsExistingSchedule;
  packageDetail: TGetPackageTimeAndDuration | null;
};

export async function handleExistingScheduleOrder({
  event,
  notes,
  packageDetail,
  payload,
}: THandleCreateScheduleOrder) {
  const {
    adultCount,
    babyCount,
    childCount,
    email,
    name,
    scheduleId,
    userId,
    packageId,
    bookingId,
  } = notes;
  let scheduleDate: Date | null = null;
  let schedulePackage: $Enums.SCHEDULED_TIME | null = null;
  try {
    const order = payload.order.entity;
    const paymentEntity = payload.payment.entity;
    const schedule = await db.schedule.findFirst({
      where: {
        id: scheduleId,
      },
      select: {
        day: true,
        schedulePackage: true,
      },
    });
    scheduleDate = schedule?.day ?? null;
    schedulePackage = schedule?.schedulePackage ?? null;
    const { booking } = await executeTransactionWithRetry(
      async () => {
        return await db.$transaction(
          async (tx) => {
            const booking = await tx.booking.create({
              data: {
                id: bookingId,
                numOfAdults: adultCount,
                numOfBaby: babyCount,
                schedule: {
                  connect: {
                    id: scheduleId,
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

            return { booking, updatedEvent };
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
        // send Whats app message to client if there is contact. (hoisted above.)
        //send Booking confirmation to User
        sendConfirmationEmail({
          recipientEmail: email,
          fromEmail: process.env.NEXT_PUBLIC_BOOKING_EMAIL!,
          emailSubject: "Minar: Your Booking has Confirmed",
          emailComponent: BookingConfirmationEmailForUser({
            adult: adultCount,
            child: childCount,
            infant: babyCount,
            packageTitle: `${packageDetail?.title ?? "--"} `,
            status: "Confirmed",
            totalAmount: order.amount_paid / 100,
            BookingId: booking.id,
            customerName: name,
            date: schedule?.day ? format(schedule.day, "dd-MM-yyyy") : "--",
            boardingTime:packageDetail?.fromTime ?? "",
            bookingDate: format(booking.createdAt, "dd-MM-yyyy"),
            contact: notes.email,
          }),
        }),

        // send email to Admin
        sendConfirmationEmail({
          recipientEmail: process.env.ADMIN_EMAIL!,
          fromEmail: process.env.NEXT_PUBLIC_BOOKING_EMAIL!,
          emailSubject: "Minar: New Booking Received",
          emailComponent: BookingConfirmationEmailForAdmin({
            scheduleId,
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
            scheduleDate: schedule?.day
              ? format(schedule.day, "dd-MM-yyyy")
              : "--",
            totalAmount: order.amount_paid / 100,
          }),
        }),
      ]);
    } catch (error) {
      // email failed or something failed.
    }
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
            date: scheduleDate ? format(scheduleDate, "dd-MM-yyyy") : "",
            eventId: event.id,
            packageTitle: packageDetail?.title ?? "",
            RazerPayEventId: event.eventId,
            scheduleTime: schedulePackage ?? "",
          },
        },
      },
    });
  }
}
