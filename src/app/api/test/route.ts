
import { TRPCError } from "@trpc/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { decideCreateOrExisting } from "@/lib/helpers/RequestToCreateSchedule";
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const dates = "2024-09-01";
    const ToDate = "2024-09-30";
    const time = "09:00:AM";
    const data = await req.json();
    const packageId = data.scheduleId ?? "cm0jjqz4x0004zoz1oyroy0v";
    const UnsafeDecider = decideCreateOrExisting(packageId);
    /**
     * check in query object to check whether the schedule already exists or to be created.
     */
    // let queryObj: QueryObj = {
    //   day: new Date(dates),
    //   schedulePackage: "DINNER",
    // };
    // Confirming Query Params using switch case to generate the event query
    switch (UnsafeDecider) {
      case "schedule.create": {
        // validate the date and throw error if using anywhere else then hoist it one level above.
        break;
      }
      case "schedule.existing": {
        // Just for type to understand scheduleId will be exists in this senerio
        if (!packageId || !packageId.length) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Sorry, We didn't find the schedule appropriate to what you are looking for..",
          });
        }
        // creating a schedule query event
        // queryObj = {
        //   id: packageId,
        //   day: undefined,
        //   schedulePackage: undefined,
        // };
        break;
      }
    }
    const schedule = await db.schedule.findFirst({
      where: {
        OR: [
          {
            day: undefined,
            schedulePackage: undefined,
          },
          { id: packageId },
        ],
      },
    });

    console.log(schedule);

    return NextResponse.json(
      {
        // state: scheduleId,
        answer: schedule,
        // answerTwo: queryObj,
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