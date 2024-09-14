import {
  TOrderEvent,
  TRazorPayEventsExistingSchedule,
} from "@/Types/razorpay/type";
import { db } from "..";
import { getDescription } from "@/lib/helpers/razorpay/utils";
import {
  DATABASE_CREATE_RETRY_LOOP_STARTS_FROM,
  MAX_DATABASE_CREATE_RETRY_LOOP,
} from "@/constants/config";
import { Booking } from "@prisma/client";
import { OrderPaidEventError } from "@/class/razorpay/OrderPaidError";
import { updateEventToFailed, updateEventToSucess } from "../data/dto/events";
import { NextResponse } from "next/server";
import {
  sendBookingFailedNotification,
  sendWhatsAppBookingMessageToClient,
} from "@/lib/helpers/retrieveWhatsAppMessage";
import { SendMessageViaWhatsapp } from "@/lib/helpers/whatsapp";
import { sendConfirmationEmail } from "@/lib/helpers/resend";
import EmailSendBookingConfirmation from "@/components/services/EmailService";
import { TGetPackageTimeAndDuration } from "../data/dto/package";
import { RemoveTimeStampFromDate } from "@/lib/utils";
import { sendAdminBookingUpdateNotification } from "@/lib/helpers/WhatsappmessageTemplate/sucess";
import { format } from "date-fns";
import { BookingConfirmationEmailForAdmin } from "@/components/services/BookingConfirmationEmailForAdmin";

export async function handleExistingScheduleOrder({
  events,
  orderBody,
  notes,
  // date,
  packageDetails,
}: TOrderEvent<any> & {
  notes: TRazorPayEventsExistingSchedule;
  // date: string;
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
      name,
      scheduleId,
      userId,
      packageId,
    } = notes;

    let booking: Booking | null = null;

    let createEventRetryLoop = DATABASE_CREATE_RETRY_LOOP_STARTS_FROM;

    let createEventFlag = false;
    while (
      createEventRetryLoop <= MAX_DATABASE_CREATE_RETRY_LOOP &&
      !createEventFlag
    ) {
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
    const schedule = await db.schedule.findFirst({
      where: {
        id: scheduleId,
      },
      select: {
        day: true,
      },
    });
    if (!booking || !booking.id) {
      console.log("Throwing Error if not Created");
      throw new OrderPaidEventError({
        code: "BOOKING_CREATE_FAILED",
        fatality: {
          fatal: true,
          message: sendBookingFailedNotification({
            customerName: name,
            customerEmail: email,
            packageName: packageDetails?.title ?? "",
            dateAttempted: schedule?.day
              ? format(schedule.day, "iii dd-MM-yyyy")
              : "",
            payId: orderBody?.payload?.payment?.entity?.id ?? "",
            reason:
              "Attempted Several times to create this Booking failed due to unknown reason Please contact customer and check with razorpay",
          }),
          // message: `schedule.create is not implimented for order ${orderBody.payload.payment.entity.id} \n Email: ${orderBody.payload.payment.entity.email} \n Email: ${orderBody.payload.payment.entity.contact}  `,
        },
      });
    }
    const sendWhatsAppClientMessage = async () => {
      if (paymentEntity.contact) {
        try {
          await SendMessageViaWhatsapp({
            recipientNumber: paymentEntity.contact,
            message: sendWhatsAppBookingMessageToClient({
              bookingId: booking.id,
              dateOfBooking: schedule?.day
                ? format(schedule.day, "iii dd-MM-yyyy")
                : "--",
              email: email,
              name,
              packageName: packageDetails?.title ?? "--",
              time: packageDetails?.fromTime ?? "--",
            }),
          });
        } catch (error) {
          console.log(error);
        }
      }
    };

    await Promise.all([
      // send Whats app message to client if there is contact. (hoisted above.)
      sendWhatsAppClientMessage(),
      //send Booking confirmation to User
      sendConfirmationEmail({
        recipientEmail: email,
        fromEmail: process.env.NEXT_PUBLIC_BOOKING_EMAIL!,
        emailSubject: "Minar: Your Booking has Confirmed",
        emailComponent: EmailSendBookingConfirmation({
          duration: `${packageDetails?.duration ?? 0 / 60 ?? "--"} Hr`,
          packageTitle: `${packageDetails?.title ?? "--"} `,
          status: "Confirmed",
          totalAmount: order.amount_paid / 100,
          totalCount: adultCount + babyCount + childCount,
          BookingId: booking.id.slice(8),
          customerName: name,
          date: schedule?.day ? format(schedule.day, "iii dd-MM-yyyy") : "--",
        }),
      }),
      // send whatsApp message to Admin
      SendMessageViaWhatsapp({
        recipientNumber: process.env.WHATS_APP_CONTACT!,
        message: sendAdminBookingUpdateNotification({
          date: schedule?.day ? format(schedule.day, "iii dd-MM-yyyy") : "--",
          packageTitle: packageDetails?.title ?? "",
          adultCount,
          babyCount,
          childCount,
          email,
          name,
        }),
      }),
      // send email to Admin
      sendConfirmationEmail({
        recipientEmail: process.env.ADMIN_EMAIL!,
        fromEmail: process.env.NEXT_PUBLIC_BOOKING_EMAIL!,
        emailSubject: "Minar: New Booking Recieved",
        emailComponent: BookingConfirmationEmailForAdmin({
          Name: name,
          adultCount: adultCount,
          babyCount: babyCount,
          BookingDate: RemoveTimeStampFromDate(booking.createdAt),
          childCount,
          email: email,
          phone: paymentEntity.contact ?? "",
          BookingId: booking.id.slice(8),
          packageTitle: packageDetails?.title ?? "",
          scheduleDate: schedule?.day
          ? format(schedule.day, "iii dd-MM-yyyy")
          : "--",
          totalAmount: order.amount_paid / 100,
        }),
      }),
    ]);

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
        return NextResponse.json({ success: false }, { status: 400 });
      }
      await updateEventToFailed({ id: events.id, description: error.message });
      return NextResponse.json({ success: false }, { status: 400 });
    }
    await updateEventToFailed({ id: events.id });
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
