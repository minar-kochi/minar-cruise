/**
 * Drives the real webhook route.
 *
 * Two details are load-bearing:
 *
 * 1. The signature is computed the way `lib/helpers/signature.ts` computes it —
 *    HMAC-SHA256 over `JSON.stringify(parsedBody)`, NOT over the raw request
 *    bytes. The route re-stringifies whatever `request.json()` gave it, so a
 *    test that signed the literal payload string would agree only by luck. This
 *    is worth knowing about the production code too: any proxy that reorders
 *    keys or re-indents the body breaks verification.
 *
 * 2. The route reads its headers from `headers()`, not from the NextRequest it
 *    is passed, so the call has to happen inside the AsyncLocalStorage scope
 *    that tests/setup/next-headers.ts provides.
 */
import crypto from "node:crypto";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/webhook/v2/razorpay/route";
import { withRequestScope } from "../setup/next-headers";

const WEBHOOK_URL = "http://localhost:3020/api/webhook/v2/razorpay";

/**
 * route.ts is declared as `POST(request, res: NextResponse)`. Next never passes
 * a second argument to a route handler and the body never reads one, so the
 * parameter is vestigial — narrowed here rather than fabricating a NextResponse
 * to satisfy it.
 */
const handler = POST as unknown as (request: NextRequest) => Promise<Response>;

export function signBody(body: unknown, secret?: string): string {
  const hmac = crypto.createHmac(
    "sha256",
    secret ?? process.env.RAZORPAY_WEBHOOK_SECRET!,
  );
  hmac.update(JSON.stringify(body));
  return hmac.digest("hex");
}

export type WebhookResult = {
  status: number;
  body: { success?: boolean } & Record<string, unknown>;
};

export async function postWebhook(
  body: unknown,
  opts: {
    eventId: string;
    /** Overrides the computed signature — pass a wrong one to test rejection. */
    signature?: string;
    /** Omits the signature header entirely. */
    omitSignature?: boolean;
    /** Omits the idempotency key header entirely. */
    omitEventId?: boolean;
  },
): Promise<WebhookResult> {
  const serialised = JSON.stringify(body);

  const headers = new Headers({ "content-type": "application/json" });
  if (!opts.omitSignature) {
    headers.set("X-Razorpay-Signature", opts.signature ?? signBody(body));
  }
  if (!opts.omitEventId) {
    headers.set("x-razorpay-event-id", opts.eventId);
  }

  const request = new NextRequest(WEBHOOK_URL, {
    method: "POST",
    headers,
    body: serialised,
  });

  const response = await withRequestScope({ headers }, () => handler(request));

  return {
    status: response.status,
    body: (await response.json()) as WebhookResult["body"],
  };
}
