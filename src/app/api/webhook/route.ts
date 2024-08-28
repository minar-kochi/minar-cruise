import { error } from "console";
import { NextRequest } from "next/server";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

export async function POST(request: NextRequest) {
  const signature = await request.headers["X-Razorpay-Signature"];
  const isValid = await validateWebhookSignature(
    JSON.stringify(request.body),
    signature,
    process.env.RAZORPAY_KEY_SECRET!,
  );
  if(!isValid){
    // @TODO add a return statement if webhook request data or secret is invalid 
  }

//   const {event, payload} = request.body;

//   switch (data.event) {
//     case "payment.authorized":
//       await handleyourAuthorizedLogic(payload);
//       break;
//     case "payment.captured":
//       await handleyourCapturedLogic(payload);
//       break;
//     case "payment.failed":
//       await handleyourFailedLogic(payload);
//       break;
//     default:
//       // console.log(`Unhandled event: ${event}`);
//       break;
//   }


}
