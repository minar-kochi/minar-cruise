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
  CreateScheduleAndBookingFailed,
  getInvalidScheduleTemplateWhatsApp,
  sendWhatsAppBookingMessageToClient,
} from "@/lib/helpers/retrieveWhatsAppMessage";
import { TGetPackageTimeAndDuration } from "../data/dto/package";
import { sendConfirmationEmail } from "@/lib/helpers/resend";
import EmailSendBookingConfirmation from "@/components/services/EmailService";
import { getSendAdminCreateNotificationMessage } from "@/lib/helpers/WhatsappmessageTemplate/sucess";
import { BookingConfirmationEmailForAdmin } from "@/components/services/BookingConfirmationEmailForAdmin";
import { RemoveTimeStampFromDate } from "@/lib/utils";
import { format } from "date-fns";

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
          message: CreateScheduleAndBookingFailed({
            orderId: orderBody?.payload?.payment?.entity?.id,
            contact: paymentEntity.contact ?? "",
            email: email,
            date: format(date, "iii dd-MM-yyyy"),
            ScheduleTime: scheduleTimeForPackage,
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
                  email: email,
                },
              },
            },
            payment: {
              create: {
                advancePaid: 0,
                discount: 0,
                // Amount paid received sa paise: convert by 100 to make to rupee
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
            email: email,
            packageTitle: packageDetails?.title ?? "",
          }),
        },
      });
    }

    try {
      if (paymentEntity.contact) {
        // send whats app sms to client about booking details.
        await SendMessageViaWhatsapp({
          recipientNumber: paymentEntity.contact,
          message: sendWhatsAppBookingMessageToClient({
            bookingId: booking.id,
            dateOfBooking: date,
            email: email,
            name,
            packageName: packageDetails?.title ?? "--",
            time: packageDetails?.fromTime ?? "--",
          }),
        });
      }

      let duration = `${packageDetails?.duration ? packageDetails.duration / 60 : "--"} Hr`


      await Promise.all([
        // send Email to Client about new booking.
        sendConfirmationEmail({
          recipientEmail: process.env.ADMIN_EMAIL!,
          fromEmail: process.env.NEXT_PUBLIC_BOOKING_EMAIL!,
          emailSubject: "Minar: New Booking Received",
          emailComponent: BookingConfirmationEmailForAdmin({
            scheduleId,
            Name: name,
            adultCount: adultCount,
            babyCount: babyCount,
            BookingDate: format(RemoveTimeStampFromDate(booking.createdAt), 'dd-MM-yyyy'),
            childCount,
            email: email,
            phone: paymentEntity.contact ?? "",
            BookingId: booking.id,
            packageTitle: packageDetails?.title ?? "",
            scheduleDate: format(date,"dd-MM-yyyy"),
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
            packageTitle: `${packageDetails?.title ?? "-"} `,
            status: "Confirmed",
            totalAmount: order.amount_paid / 100,
            totalCount: adultCount + babyCount + childCount,
            BookingId: booking.id,
            customerName: name,
            date: format(date,"dd-MM-yyyy"),
          }),
        }),
        //Send admin Create Notification to whats app
        SendMessageViaWhatsapp({
          recipientNumber: process.env.WHATS_APP_CONTACT!,
          message: getSendAdminCreateNotificationMessage({
            date,
            packageName: `${packageDetails?.title ?? "-"} `,
            time: `${packageDetails?.fromTime}`,
          }),
          temp: {
            allow: true,
            FromEmail: process.env.NEXT_PUBLIC_INFO_EMAIL!,
            error: false,
            Emailheading: "New Schedule has been placed",
            subject: "INFO: New Schedule has been placed",
          },
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
          temp: {
            allow: true,
            FromEmail: process.env.NEXT_PUBLIC_ERROR_EMAIL!,
            error: true,
            subject:
              "URGENT: Something went wrong while processing the request.",
            Emailheading:
              "URGENT: FATAL Server Error, Please Review and contact Customer.",
          },
        });
        await updateEventToFailed({
          id: events.id,
          description: error.message,
          failedCountSetter: 6,
        });
        return NextResponse.json({ success: false }, { status: 200 });
      }
      await updateEventToFailed({ id: events.id, description: error.message });
      return NextResponse.json({ success: false }, { status: 400 });
    }
    await updateEventToFailed({ id: events.id });
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
