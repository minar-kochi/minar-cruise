/**
 * Assertions for resolveBookingLinkExpiry after the switch to instants.
 *
 *   docker exec --user node -w /workspace/minar-cruise minar-dev \
 *     npx tsx scripts/assert-booking-link-expiry.ts
 *
 * The behaviour that changed: this used to take (scheduleDate, "6:30:AM") and
 * parse the string here, falling back to the UNCLAMPED TTL when parsing failed.
 * That fallback was a real hole — an unpadded or malformed `fromTime` silently
 * disabled the departure clamp, leaving a link payable right up to sailing. It
 * now takes a Date, which cannot fail to parse, so the hole is gone by
 * construction rather than by care.
 */
import { resolveBookingLinkExpiry } from "../src/lib/helpers/bookingLink/expiry";
import { istInstant, type IstDayKey } from "../src/lib/datetime";

let failures = 0;
const key = (s: string) => s as IstDayKey;

function check(label: string, actual: unknown, expected: unknown) {
  const a = actual instanceof Date ? actual.toISOString() : actual;
  const e = expected instanceof Date ? expected.toISOString() : expected;
  const ok = a === e;
  if (!ok) failures++;
  console.log(
    `${ok ? "  ok  " : " FAIL "} ${label}${ok ? "" : ` — expected ${e}, got ${a}`}`,
  );
}

const rule = (minLeadTimeHours: number) =>
  ({
    minLeadTimeHours,
    minNewBookingCount: 0,
    isBookableOnline: true,
    maxBoatSeat: 150,
  }) as any;

console.log(`\nTZ=${process.env.TZ ?? "(unset)"}`);

// Breakfast departs 09:00 IST on 2026-08-20 -> 2026-08-20T03:30:00Z
const departsAt = istInstant(key("2026-08-20"), 540);
const now = new Date("2026-08-16T00:00:00.000Z");

console.log("\nTTL shorter than the departure cutoff — TTL wins");
{
  const r = resolveBookingLinkExpiry({ departsAt, expiryHours: 24, rule: rule(2), now });
  check("expires at now+24h", r.expiresAt, new Date("2026-08-17T00:00:00.000Z"));
  check("not clamped", r.clampedToDeparture, false);
}

console.log("\nTTL overshoots the departure — clamped to the cutoff");
{
  // 7-day TTL on a sailing 4 days out, 2h lead -> must die at departure-2h.
  const r = resolveBookingLinkExpiry({ departsAt, expiryHours: 24 * 7, rule: rule(2), now });
  check("clamped to departure-2h", r.expiresAt, new Date("2026-08-20T01:30:00.000Z"));
  check("reports the clamp", r.clampedToDeparture, true);
}

console.log("\nBreakfast's 16h lead reaches back to the previous evening");
{
  const r = resolveBookingLinkExpiry({ departsAt, expiryHours: 24 * 7, rule: rule(16), now });
  check("clamped to departure-16h", r.expiresAt, new Date("2026-08-19T11:30:00.000Z"));
  check("reports the clamp", r.clampedToDeparture, true);
}

console.log("\nFractional lead hours stay whole milliseconds");
{
  const r = resolveBookingLinkExpiry({ departsAt, expiryHours: 24 * 7, rule: rule(1.5), now });
  check("clamped to departure-90m", r.expiresAt, new Date("2026-08-20T02:00:00.000Z"));
  check("no fractional ms", r.expiresAt.getTime() % 1, 0);
}

console.log("\nZero lead time — the cutoff is departure itself");
{
  const r = resolveBookingLinkExpiry({ departsAt, expiryHours: 24 * 7, rule: rule(0), now });
  check("clamped to departure", r.expiresAt, departsAt);
}

console.log("\nA sailing already inside its lead window yields a past expiry");
{
  // The caller rejects on expiresAt <= now; prove it produces something in the
  // past rather than silently handing out a live link.
  const late = new Date("2026-08-20T02:00:00.000Z"); // 30 min inside a 2h lead
  const r = resolveBookingLinkExpiry({ departsAt, expiryHours: 72, rule: rule(2), now: late });
  check("expiry is before 'now'", r.expiresAt < late, true);
  check("reports the clamp", r.clampedToDeparture, true);
}

console.log(
  failures === 0
    ? "\nAll booking-link expiry assertions passed.\n"
    : `\n${failures} assertion(s) FAILED.\n`,
);
process.exit(failures === 0 ? 0 : 1);
