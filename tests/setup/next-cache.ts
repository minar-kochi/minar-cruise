/**
 * Stands in for `next/cache`.
 *
 * `getBookingConfig`, `getTaxConfig` and `getSiteConfig` are all wrapped in
 * `unstable_cache`, which reads Next's request-scoped store and throws outside
 * a request context. Every server path the tests drive goes through at least
 * one of them, so without this the suite cannot import them at all.
 *
 * Passing the function straight through also makes each read hit the database,
 * which is what deterministic tests want: a test that changes `maxBoatSeat`
 * must see the new value on the next call, not a memoised one.
 */

export function unstable_cache<T extends (...args: never[]) => Promise<unknown>>(
  fn: T,
  _keyParts?: string[],
  _options?: { tags?: string[]; revalidate?: number | false },
): T {
  return fn;
}

export function revalidateTag(_tag: string): void {}

export function revalidatePath(_path: string, _type?: "layout" | "page"): void {}

export function unstable_noStore(): void {}
