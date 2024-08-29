import { $RazorPay } from "@/lib/helpers/RazorPay";
import { generateSignature } from "@/lib/helpers/signature";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const { RAZORPAY_WEBHOOK_SECRET } = process.env;
if (!RAZORPAY_WEBHOOK_SECRET) {
  throw new Error("Please Define RAZORPAY_WEBHOOK_SECRET");
}
export async function POST(request: NextRequest, res: NextResponse) {
  try {
    const header = headers();
    const IncommingSignature = header.get("X-Razorpay-Signature");
    console.log(IncommingSignature)
    if (!IncommingSignature) {
      // throw a valid error.
      return NextResponse.json({ success: false }, { status: 400 });
    }
    // get body
    let body = await request.json();
    console.log(body)
    /// calculating signature from the body and secrect
    const generatedSignature = generateSignature(body);
    // check whether the generated and incomming are same, if so use the body and the body is securely send from razor-pay
    if (generatedSignature !== IncommingSignature) {
      // throw a valid error.
      return NextResponse.json({ success: false }, { status: 400 });
    } 
        
    // const data = await $RazorPay.orders.fetch('')
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false });
  }
}