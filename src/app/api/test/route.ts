// import { $RazorPay } from "@/lib/helpers/RazorPay";
import {
  DATABASE_CREATE_RETRY_LOOP_STARTS_FROM,
  MAX_DATABASE_CREATE_RETRY_LOOP,
  MAX_EVENT_RETRY_WEBHOOK_COUNT,
} from "@/constants/config";
import { ThrowTemplate } from "@/db/data/dto/events";
import { handleOrderPaidEvent } from "@/db/hooks/razorpay";
import { sleep } from "@/lib/utils";
import { PROCESSING_STATUS } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    let createEventRetryLoop = DATABASE_CREATE_RETRY_LOOP_STARTS_FROM;

    let createEventFlag = false;

    let triggerCount = 2;

    let data = await req.json();

    const DbEvent: PROCESSING_STATUS = data.event;

    switch (DbEvent) {
      case "SUCCESS": {
        return NextResponse.json({ success: true }, { status: 200 });
        break;
      }
      case "FAILED": {
        await handleOrderPaidEvent({ events: "world" });
        // throw new handleOrderPaidEvent({ code: "BAD_REQUEST", message: "FAILED" });
        break;
      }
      case "PROCESSING": {
        return NextResponse.json({ success: true }, { status: 425 });
        break;
      }
    }
    console.log("Sucessfully returned");
    return NextResponse.json({ order: true }, { status: 425 });
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
