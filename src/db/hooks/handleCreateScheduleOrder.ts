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

export async function handleCreateScheduleOrder({
  events,
  orderBody,
}: TOrderEvent<any>) {
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
    } = order.notes as TRazorPayEventsCreateSchedule;
    const scheduleTimeForPackage =
      findCorrespondingScheduleTimeFromPackageCategory(ScheduleTime);

    // This error wont throw unless Sender route messed up anything. ;)
    if (!scheduleTimeForPackage) {
      throw new OrderPaidEventError({
        code: "SCHEDULE_TIME_NOT_FOUND",
        fatality: {
          message: "Couldn't find corresponding ScheduleTime",
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
          message: "Couldn't able to Create a schedule.",
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
                discount: 100,
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
          // fatal: true,
          message: `Failed to Create Booking for orderID: ${orderBody.payload.payment.entity.id} \n Email: ${orderBody.payload.payment.entity.email} \n Email: ${orderBody.payload.payment.entity.contact}  `,
        },
      });
    }

    console.log("Updating Events");
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
