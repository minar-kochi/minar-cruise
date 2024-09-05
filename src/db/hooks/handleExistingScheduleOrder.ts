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

export async function handleExistingScheduleOrder({
  events,
  orderBody,
  notes
}: TOrderEvent<any> & {notes: TRazorPayEventsExistingSchedule}) {
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
    } = notes

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
                  email: paymentEntity.email ?? email,
                },
              },
            },
            payment: {
              create: {
                advancePaid: 0,
                discount: 0,
                totalAmount: order.amount_paid,
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
          fatal: true,
          message: `schedule.create is not implimented for order ${orderBody.payload.payment.entity.id} \n Email: ${orderBody.payload.payment.entity.email} \n Email: ${orderBody.payload.payment.entity.contact}  `,
        },
      });
    }
    await updateEventToSucess({ id: events.id });
    console.log("Returning 200 Response");
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof OrderPaidEventError) {
      if (error.fatal) {
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
