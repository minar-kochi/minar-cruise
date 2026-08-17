import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

/**
 * Env for every test process.
 *
 * Two modules throw at import time when these are missing — `lib/helpers/RazorPay`
 * and the webhook route itself — so they have to be set before anything is loaded,
 * which is what this block does. The values are deliberately fake: `orders.create`
 * is mocked (tests/setup/mocks.ts), and the webhook secret only ever has to agree
 * with the one tests/helpers/webhook.ts signs with.
 *
 * IMPORTANT — importing `@prisma/client` runs dotenv over minar-cruise/.env and
 * populates `process.env` from it. Anything the real .env defines is therefore
 * live inside the test process unless it is pinned here first: dotenv does not
 * overwrite a key that already has a value, so this block wins, but only for the
 * keys it actually names. That is why the three below are set to "" rather than
 * simply left out — leaving them out is how the real reCAPTCHA secret ends up
 * in the suite and every booking call starts demanding a captcha token.
 *
 * The same leak is why tests/setup/db-guard.ts asks the server which database it
 * actually reached instead of trusting DATABASE_URL here.
 */
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  "postgres://myuser:mypassword@localhost:5432/minar_test";

const env = {
  DATABASE_URL: TEST_DATABASE_URL,
  DIRECT_URL: TEST_DATABASE_URL,
  RAZORPAY_WEBHOOK_SECRET: "test_webhook_secret",
  NEXT_PUBLIC_RAZORPAY_KEYID: "rzp_test_keyid",
  RAZORPAY_KEY_SECRET: "test_key_secret",
  BUSINESS_EMAIL: "business@test.invalid",
  NEXT_PUBLIC_BOOKING_EMAIL: "booking@test.invalid",
  NEXT_PUBLIC_ADMIN_EMAIL: "admin@test.invalid",
  ADMIN_EMAIL: "admin@test.invalid",
  DEV_EMAIL: "dev@test.invalid",
  NEXT_PUBLIC_SYSTEM_EMAIL: "system@test.invalid",
  NEXT_PUBLIC_DOMAIN: "http://localhost:3020",

  // Pinned empty on purpose — see the note above.
  // recaptcha.ts returns early when the secret is falsy, which is the no-op the
  // suite wants; with the real secret present every mutation demands a token.
  RECAPTCHA_SITE_SECRET: "",
  // src/server/trpc.ts blocks EVERY tRPC mutation when APP_ENV is "staging".
  APP_ENV: "",
  // "1" redirects the whole public site to /maintenance.
  NEXT_PUBLIC_MAINTENANCE: "",
};

/**
 * `server-only` throws outside an RSC; `next/cache` and `next/headers` read
 * request-scoped storage that does not exist here. Aliasing is scoped to the
 * test run, unlike the `Module._resolveFilename` patch in
 * scripts/_stub-server-only.cjs that this replaces.
 */
const resolve = {
  tsconfigPaths: true,
  alias: {
    "server-only": here("./tests/setup/empty.ts"),
    "next/cache": here("./tests/setup/next-cache.ts"),
    "next/headers": here("./tests/setup/next-headers.ts"),
  },
};

/**
 * tsconfig.json sets `jsx: "preserve"` because Next does its own JSX transform.
 * Vite has to do it here instead: the webhook route imports the `.tsx` admin
 * alert templates, so untransformed JSX would fail the whole integration suite
 * at import time.
 */
const oxc = { jsx: "automatic" } as const;

export default defineConfig({
  resolve,
  oxc,
  test: {
    // The webhook path is chatty by design ("EVENT REACHED!", the full notes
    // object, every retry). Keep it for failures, where it is exactly what you
    // want, and drop it for passes.
    silent: "passed-only",
    projects: [
      {
        resolve,
        oxc,
        test: {
          name: "unit",
          root: import.meta.dirname,
          include: ["tests/unit/**/*.test.ts"],
          environment: "node",
          env,
          setupFiles: [here("./tests/setup/mocks.ts")],
        },
      },
      {
        resolve,
        oxc,
        test: {
          name: "integration",
          root: import.meta.dirname,
          include: ["tests/integration/**/*.test.ts"],
          environment: "node",
          env,
          setupFiles: [
            here("./tests/setup/mocks.ts"),
            here("./tests/setup/db-guard.ts"),
          ],
          // One database, shared by every file: run them one at a time so
          // truncation in one file cannot pull rows out from under another.
          pool: "forks",
          fileParallelism: false,
          maxWorkers: 1,
          testTimeout: 30_000,
          hookTimeout: 30_000,
        },
      },
    ],
  },
});
