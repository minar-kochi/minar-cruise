/**
 * Guards on the test harness itself, not on the app.
 *
 * Each of these covers one alias or env pin that the rest of the suite silently
 * depends on. When one breaks, the failure elsewhere is an unreadable import
 * error deep inside a Next internal — so it is worth failing here first, by name.
 */
import { describe, expect, it } from "vitest";
import { IST_ZONE, istInstant, type IstDayKey } from "@/lib/datetime";
import { getBookingConfig } from "@/lib/helpers/config/getBookingConfig";

describe("harness", () => {
  it("resolves the @/ path alias", () => {
    expect(IST_ZONE).toBe("Asia/Kolkata");
    expect(istInstant("2026-08-16" as IstDayKey, 540).toISOString()).toBe(
      "2026-08-16T03:30:00.000Z",
    );
  });

  it("neutralises server-only and unstable_cache", () => {
    // getBookingConfig imports "server-only" (throws outside an RSC) and is
    // wrapped in unstable_cache (throws outside a request scope). Importing it
    // at all proves both aliases are wired.
    expect(typeof getBookingConfig).toBe("function");
  });

  it("pins the env that .env would otherwise supply", () => {
    // Importing @prisma/client runs dotenv over the real .env, so anything not
    // named in vitest.config.mts leaks in from there.
    expect(process.env.RAZORPAY_WEBHOOK_SECRET).toBe("test_webhook_secret");
    expect(process.env.DATABASE_URL).toContain("minar_test");
    // Falsy or every booking call demands a live captcha token.
    expect(process.env.RECAPTCHA_SITE_SECRET).toBeFalsy();
    // "staging" blocks every tRPC mutation.
    expect(process.env.APP_ENV).toBeFalsy();
  });
});
