import crypto from "crypto";
// generate the signature
export function generateSignature(data: any) {
  const hmac = crypto.createHmac(
    "sha256",
    process.env.RAZORPAY_WEBHOOK_SECRET!,
  );
  hmac.update(JSON.stringify(data));
  return hmac.digest("hex");
}
