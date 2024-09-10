import { TRPCError } from "@trpc/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { decideCreateOrExisting } from "@/lib/helpers/RequestToCreateSchedule";
import { SendMessageViaWhatsapp } from "@/lib/helpers/whatsapp";
import { sendWhatsAppBookingMessageToClient } from "@/lib/helpers/retrieveWhatsAppMessage";
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    let number = "919562103255";
    const data = await SendMessageViaWhatsapp({
      recipientNumber: number,
      // messageTemplate:"rs_vp_id",
      message: sendWhatsAppBookingMessageToClient({
        bookingId: "1245",
        dateOfBooking: "07/10/2024",
        email: "muadpn434@gmail.com",
        name: "Mouad Pn",
        packageName: "Lunch Cruise",
        time: "11:00AM",
      }),
    });
    return NextResponse.json(
      {
        state: number,
        answer: data,
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
