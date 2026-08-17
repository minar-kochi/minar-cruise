/**
 * Stands in for `next/headers`.
 *
 * The webhook route reads its Razorpay signature and event id from `headers()`
 * rather than from the `NextRequest` it is handed:
 *
 *   const header = headers();
 *   const IncommingSignature = header.get("X-Razorpay-Signature");
 *
 * Next resolves that from a request-scoped AsyncLocalStorage, so calling the
 * exported `POST` directly would throw before reaching a single line of the
 * logic under test. This shim provides the same storage, and
 * `tests/helpers/webhook.ts` runs each call inside it with the request's own
 * headers — so the route reads exactly what was posted, signature included.
 */
import { AsyncLocalStorage } from "node:async_hooks";

type RequestScope = {
  headers: Headers;
  cookies: Map<string, string>;
};

export const requestScope = new AsyncLocalStorage<RequestScope>();

/** Runs `fn` with `headers()` resolving to `init`. */
export function withRequestScope<T>(
  init: { headers?: Headers; cookies?: Map<string, string> },
  fn: () => T,
): T {
  return requestScope.run(
    {
      headers: init.headers ?? new Headers(),
      cookies: init.cookies ?? new Map(),
    },
    fn,
  );
}

export function headers(): Headers {
  const scope = requestScope.getStore();
  if (!scope) {
    throw new Error(
      "headers() was called outside withRequestScope(). Route handlers under " +
        "test must be invoked through tests/helpers/webhook.ts.",
    );
  }
  return scope.headers;
}

export function cookies() {
  const scope = requestScope.getStore();
  if (!scope) {
    throw new Error("cookies() was called outside withRequestScope().");
  }
  const store = scope.cookies;
  return {
    get: (name: string) =>
      store.has(name) ? { name, value: store.get(name)! } : undefined,
    // Array.from, not [...spread]: tsconfig sets no `target`, so it defaults
    // below ES2015 and spreading a Map iterator needs --downlevelIteration.
    getAll: () =>
      Array.from(store.entries()).map(([name, value]) => ({ name, value })),
    has: (name: string) => store.has(name),
    set: (name: string, value: string) => void store.set(name, value),
    delete: (name: string) => void store.delete(name),
  };
}

export function draftMode() {
  return { isEnabled: false, enable: () => {}, disable: () => {} };
}
