import { getDescription, getEvents } from "@/lib/helpers/razorpay/utils";
import {
  TOrderEvent,
  TRazorPayEventsCreateSchedule,
} from "@/Types/razorpay/type";
import { db } from "..";
import {
  DATABASE_CREATE_RETRY_LOOP_STARTS_FROM,
  MAX_DATABASE_CREATE_RETRY_LOOP,
} from "@/constants/config";
import { findCorrespondingScheduleTimeFromPackageCategory } from "@/lib/Data/manipulators/ScheduleManipulators";
import { OrderPaidEventError } from "@/class/razorpay/OrderPaidError";
import { Booking } from "@prisma/client";
import { updateEventToFailed, updateEventToSucess } from "../data/dto/events";
import { NextResponse } from "next/server";
import { CreateSchedule } from "../data/creator/schedule";
import { SendMessageViaWhatsapp } from "@/lib/helpers/whatsapp";
import {
  CreateBookingFailed,
  getInvalidScheduleTemplateWhatsApp,
  sendWhatsAppBookingMessageToClient,
} from "@/lib/helpers/retrieveWhatsAppMessage";
import { TGetPackageTimeAndDuration } from "../data/dto/package";
import { sendConfirmationEmail } from "@/lib/helpers/resend";
import EmailSendBookingConfirmation from "@/components/services/EmailService";
import { getSendAdminCreateNotificationMessage } from "@/lib/helpers/WhatsappmessageTemplate/sucess";
import { BookingConfirmationEmailForAdmin } from "@/components/services/BookingConfirmationEmailForAdmin";
import { RemoveTimeStampFromDate } from "@/lib/utils";

export async function handleCreateScheduleOrder({
  events,
  orderBody,
  notes,
  packageDetails,
}: TOrderEvent<any> & {
  notes: TRazorPayEventsCreateSchedule;
  packageDetails: TGetPackageTimeAndDuration | null;
}) {
  try {
    console.log("Getting order");
    const order = orderBody.payload.order.entity;
    console.log("ORDER:", order);
    const paymentEntity = orderBody.payload.payment.entity;
    const {
      adultCount,
      babyCount,
      childCount,
      email,
      eventType,
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
          message: getInvalidScheduleTemplateWhatsApp({
            ScheduleTime,
            packageTitle: packageDetails?.title ?? "",
            date,
            adultCount: `${adultCount}`,
            babyCount: `${babyCount}`,
            childCount: `${childCount}`,
            email: email,
            name: name,
          }),
          fatal: true,
        },
      });
    }

    const createSchedule = await CreateSchedule({
      packageId,
      date,
      scheduleTimeForPackage,
      scheduleStatus: "AVAILABLE",
    });

    if (!createSchedule) {
      throw new OrderPaidEventError({
        code: "FAILED_CREATING_SCHEDULE_TIME",
        fatality: {
          message: CreateBookingFailed({
            orderId: orderBody?.payload?.payment?.entity?.id,
            contact: paymentEntity.contact ?? "",
            email: paymentEntity.email ?? email,
            packageTitle: packageDetails?.title ?? "",
          }),
          fatal: true,
        },
      });
    }
    const scheduleId = createSchedule.id;
    let booking: Booking | null = null;
    let createEventRetryLoop = DATABASE_CREATE_RETRY_LOOP_STARTS_FROM;
    let createEventFlag = false;
    while (
      createEventRetryLoop <= MAX_DATABASE_CREATE_RETRY_LOOP &&
      !createEventFlag
    ) {
      console.log("Trying to create Booking");
      try {
        booking = await db.booking.create({
          data: {
            schedule: {
              connect: {
                id: scheduleId,
              },
            },
            numOfAdults: adultCount,
            numOfBaby: babyCount,
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
                  email: paymentEntity.email ?? email,
                },
              },
            },
            payment: {
              create: {
                advancePaid: 0,
                discount: 0,
                // Amount paid recieved sa paise: convert by 100 to make to ruppe
                totalAmount: order.amount_paid / 100,
                modeOfPayment: "ONLINE",
              },
            },
          },
        });
        console.log("booking created");
        createEventFlag = true;
        continue;
      } catch (error) {
        createEventRetryLoop++;
      }
    }
    if (!booking || !booking.id) {
      console.log("Throwing Error if not Created");
      throw new OrderPaidEventError({
        code: "BOOKING_CREATE_FAILED",
        fatality: {
          message: CreateBookingFailed({
            orderId: orderBody?.payload?.payment?.entity?.id,
            contact: paymentEntity.contact ?? "",
            email: paymentEntity.email ?? email,
            packageTitle: packageDetails?.title ?? "",
          }),
        },
      });
    }

    try {
      if (paymentEntity.contact) {
        await SendMessageViaWhatsapp({
          recipientNumber: paymentEntity.contact,
          message: sendWhatsAppBookingMessageToClient({
            bookingId: booking.id,
            dateOfBooking: date,
            email: paymentEntity.email ?? email,
            name,
            packageName: packageDetails?.title ?? "--",
            time: packageDetails?.fromTime ?? "--",
          }),
          error: false,
        });
      }

      await Promise.all([
        sendConfirmationEmail({
          recipientEmail: paymentEntity.email ?? email,
          fromEmail: process.env.NEXT_PUBLIC_BOOKING_EMAIL!,
          emailSubject: "Minar: New Booking is Recieved",
          emailComponent: BookingConfirmationEmailForAdmin({
            Name: name,
            adultCount: adultCount,
            babyCount: babyCount,
            BookingDate: RemoveTimeStampFromDate(booking.createdAt),
            childCount,
            email: paymentEntity.email ?? email,
            phone: paymentEntity.contact ?? "",
            BookingId: booking.id.slice(8),
            packageTitle: packageDetails?.title ?? "",
            scheduleDate: date,
            totalAmount: order.amount_paid / 100,
          }),
        }),
        // Send Email to Client
        sendConfirmationEmail({
          recipientEmail: paymentEntity.email ?? email,
          fromEmail: process.env.BUSINESS_EMAIL!,
          emailSubject: "Minar: Your Booking has Confirmed",
          emailComponent: EmailSendBookingConfirmation({
            duration: `${packageDetails?.duration ?? "-"}`,
            packageTitle: `${packageDetails?.title ?? "-"} `,
            status: "Confirmed",
            totalAmount: order.amount_paid,
            totalCount: adultCount + babyCount + childCount,
            BookingId: booking.id.slice(8),
            customerName: name,
            date,
          }),
        }),

        //Send admin Notification to whats appp
        SendMessageViaWhatsapp({
          recipientNumber: process.env.NEXT_PUBLIC_CONTACT!,
          message: getSendAdminCreateNotificationMessage({
            date,
            packageName: `${packageDetails?.title ?? "-"} `,
            time: `${packageDetails?.fromTime}`,
          }),
          error: false,
        }),
      ]);
    } catch (error) {
      console.log(error);
    }

    await updateEventToSucess({ id: events.id });
    console.log("Returning 200 Response");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof OrderPaidEventError) {
      if (error.fatal) {
        await SendMessageViaWhatsapp({
          recipientNumber: process.env.NEXT_PUBLIC_CONTACT!,
          message: error.message,
          error: true,
        });
        await updateEventToFailed({
          id: events.id,
          description: error.message,
          failedCountSetter: 6,
        });

        return NextResponse.json({ success: false }, { status: 400 });
      }
      await updateEventToFailed({ id: events.id, description: error.message });
      return NextResponse.json({ success: false }, { status: 400 });
    }
    await updateEventToFailed({ id: events.id });
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
