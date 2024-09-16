import Razorpay from "razorpay";
import crypto from "crypto";

const { NEXT_PUBLIC_RAZORPAY_KEYID, RAZORPAY_KEY_SECRET } = process.env;
if (!NEXT_PUBLIC_RAZORPAY_KEYID || !RAZORPAY_KEY_SECRET) {
  throw new Error(
    "Please ensure NEXT_PUBLIC_RAZORPAY_KEYID or RAZORPAY_KEY_SECRET  is defined in env",
  );
}
export const $RazorPay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEYID!,
  key_secret: RAZORPAY_KEY_SECRET,
});

// generate the hashed signature

export function generateSignature(data: string) {
  const hmac = crypto.createHmac(
    "sha256",
    process.env.RAZORPAY_WEBHOOK_SECRET!,
  );
  hmac.update(JSON.stringify(data));
  return hmac.digest("hex");
}
