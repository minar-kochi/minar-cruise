// import { $RazorPay } from "@/lib/helpers/RazorPay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // const order = await $RazorPay.orders.create({
    //   amount: 10000,
    //   currency: "INR",
    //   notes: {
    //     hello: "wow",
    //   },
    // });

    return NextResponse.json({ order:true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { failed: " somethign went wrong" },
      { status: 400 },
    );
  }
}
