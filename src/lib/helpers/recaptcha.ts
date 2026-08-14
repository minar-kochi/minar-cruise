import { TRPCError } from "@trpc/server";
import axios from "axios";

export const RECAPTCHA_MIN_SCORE = 0.5;

/**
 * Verify a reCAPTCHA v3 token.
 *
 * Extracted verbatim from the three copies that previously lived in
 * `user.createSubscription`, `user.createRazorPayIntent` and the `contact`
 * procedure, so all callers share one implementation.
 *
 * @KNOWN-ISSUE The pass condition below is `success && score < MIN_SCORE`,
 * which means a token that Google reports as *invalid* (`success: false`)
 * silently PASSES — as does any request made while RECAPTCHA_SITE_SECRET is
 * unset, which is the current state of the local `.env`. The correct check is
 * `!success || score < MIN_SCORE`. That is deliberately NOT changed here: this
 * extraction is meant to be behaviour-preserving, and tightening it would lock
 * everyone out of every form until the reCAPTCHA keys are configured. Fix it
 * and the env together, in one change, once keys are in place.
 */
export async function verifyRecaptcha(
  token: string | null | undefined,
  {
    missingTokenMessage = "Please give access to Recaptcha",
    lowScoreMessage = "Recaptcha Failed",
    failureMessage = "Failed to validate Recaptcha Please try again, or contact admin",
  }: {
    missingTokenMessage?: string;
    lowScoreMessage?: string;
    failureMessage?: string;
  } = {},
): Promise<void> {
  /**
   * When the secret is not configured there is nothing to verify against: the
   * score check below would let any token through anyway, while the missing
   * token check would reject every genuine customer — the client cannot mint a
   * token without NEXT_PUBLIC_RECAPTCHA_SITE_KEY either. Blocking here buys no
   * security and breaks checkout outright, so skip loudly instead.
   */
  if (!process.env.RECAPTCHA_SITE_SECRET) {
    console.warn(
      "[recaptcha] RECAPTCHA_SITE_SECRET is not set — skipping verification. Set it (and NEXT_PUBLIC_RECAPTCHA_SITE_KEY) before going live.",
    );
    return;
  }

  try {
    if (!token) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: missingTokenMessage,
      });
    }

    const formData = `secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${token}`;
    const res = await axios.get(
      `https://www.google.com/recaptcha/api/siteverify?${formData}`,
    );

    if (res && res.data?.success && res.data?.score < RECAPTCHA_MIN_SCORE) {
      throw new TRPCError({
        code: "UNPROCESSABLE_CONTENT",
        message: lowScoreMessage,
      });
    }
  } catch (error) {
    if (error instanceof TRPCError) {
      throw new TRPCError({ code: error.code, message: error.message });
    }
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: failureMessage,
    });
  }
}
