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

export async function handleExistingScheduleOrder({
  events,
  orderBody,
}: TOrderEvent<any>) {
  try {
    const order = orderBody.payload.order;
    const paymentEntity = orderBody.payload.payment.entity;
    const {
      adultCount,
      babyCount,
      childCount,
      email,
      eventType,
      name,
      packageId,
      scheduleId,
      userId,
    } = orderBody.payload.order.notes as TRazorPayEventsExistingSchedule;
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
                discount: 100,
                totalAmount: order.amount_paid,
                modeOfPayment: "ONLINE",
              },
            },
          },
        });
        createEventFlag = true;
        continue;
      } catch (error) {
        createEventRetryLoop++;
      }
    }
    if (!booking || !booking.id) {
      throw new OrderPaidEventError({
        code: "BOOKING_CREATE_FAILED",
        fatality: {
          fatal: true,
          message: `schedule.create is not implimented for order ${orderBody.payload.payment.entity.id} \n Email: ${orderBody.payload.payment.entity.email} \n Email: ${orderBody.payload.payment.entity.contact}  `,
        },
      });
    }
    return true;
  } catch (error) {}
}
