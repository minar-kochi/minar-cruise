// import { $RazorPay } from "@/lib/helpers/RazorPay";
import {
  DATABASE_CREATE_RETRY_LOOP_STARTS_FROM,
  MAX_DATABASE_CREATE_RETRY_LOOP,
  MAX_EVENT_RETRY_WEBHOOK_COUNT,
} from "@/constants/config";
import { ThrowTemplate } from "@/db/data/dto/events";
import { handleOrderPaidEvent } from "@/db/hooks/razorpay";
import {
  combineDateWithSplitedTime,
  convert12HourTo24Hour,
  convertYYYMMDDStringAndTimeStringToUTCDate,
  getISTDateAndTimeFromZ,
  getUTCDate,
  parseDateFormatYYYMMDDToNumber,
  RemoveTimeStampFromDate,
  sleep,
  splitTimeColon,
} from "@/lib/utils";
import { PROCESSING_STATUS } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import luxon, { DateTime, Zone } from "luxon";
import { isStatusBreakfast } from "@/lib/validators/Schedules";
import { MIN_BREAKFAST_BOOKING_HOUR } from "@/constants/config/business";
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const dates = "2024-09-01";
    const time = "09:00:AM";
    const dateTimeString = `${dates} ${time}`;
    const serverDate = new Date(Date.now());

    const UTCISTDATE = convertYYYMMDDStringAndTimeStringToUTCDate(dates, time);
    if(!UTCISTDATE){
      throw new Error('something is not wright')
    }
    const timeGap = UTCISTDATE?.LuxObj.diffNow("hour").hours;
    console.log(timeGap)
    if (isStatusBreakfast("BREAKFAST")) {
      console.log(timeGap > MIN_BREAKFAST_BOOKING_HOUR)
    }
    return NextResponse.json(
      {
        state: dateTimeString,
        answer: UTCISTDATE,
        currentTime: new Date(Date.now()),
      },
      { status: 425 },
    );
  } catch (error) {
    console.log(error);
    if (error instanceof TRPCError) {
      console.log(error.code);
    }
    return NextResponse.json(
      { failed: " somethign went wrong" },
      { status: 400 },
    );
  }
}

// export async function GET() {

// }
