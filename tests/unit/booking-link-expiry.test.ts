/**
 * Assertions for `resolveBookingLinkExpiry`. Ported from
 * scripts/assert-booking-link-expiry.ts.
 *
 * The behaviour that changed: this used to take (scheduleDate, "6:30:AM") and
 * parse the string here, falling back to the UNCLAMPED TTL when parsing failed.
 * That fallback was a real hole — an unpadded or malformed `fromTime` silently
 * disabled the departure clamp, leaving a link payable right up to sailing. It
 * now takes a Date, which cannot fail to parse, so the hole is gone by
 * construction rather than by care.
 */
import { describe, expect, it } from "vitest";
import { istInstant, type IstDayKey } from "@/lib/datetime";
import { resolveBookingLinkExpiry } from "@/lib/helpers/bookingLink/expiry";

const key = (s: string) => s as IstDayKey;

const rule = (minLeadTimeHours: number) =>
  ({
    minLeadTimeHours,
    minNewBookingCount: 0,
    isBookableOnline: true,
    maxBoatSeat: 150,
  }) as never;

// Breakfast departs 09:00 IST on 2026-08-20 -> 2026-08-20T03:30:00Z
const departsAt = istInstant(key("2026-08-20"), 540);
const now = new Date("2026-08-16T00:00:00.000Z");

describe("TTL shorter than the departure cutoff — TTL wins", () => {
  const r = resolveBookingLinkExpiry({ departsAt, expiryHours: 24, rule: rule(2), now });

  it("expires at now+24h", () =>
    expect(r.expiresAt).toEqual(new Date("2026-08-17T00:00:00.000Z")));
  it("not clamped", () => expect(r.clampedToDeparture).toBe(false));
});

describe("TTL overshoots the departure — clamped to the cutoff", () => {
  // 7-day TTL on a sailing 4 days out, 2h lead -> must die at departure-2h.
  const r = resolveBookingLinkExpiry({
    departsAt,
    expiryHours: 24 * 7,
    rule: rule(2),
    now,
  });

  it("clamped to departure-2h", () =>
    expect(r.expiresAt).toEqual(new Date("2026-08-20T01:30:00.000Z")));
  it("reports the clamp", () => expect(r.clampedToDeparture).toBe(true));
});

describe("Breakfast's 16h lead reaches back to the previous evening", () => {
  const r = resolveBookingLinkExpiry({
    departsAt,
    expiryHours: 24 * 7,
    rule: rule(16),
    now,
  });

  it("clamped to departure-16h", () =>
    expect(r.expiresAt).toEqual(new Date("2026-08-19T11:30:00.000Z")));
  it("reports the clamp", () => expect(r.clampedToDeparture).toBe(true));
});

describe("Fractional lead hours stay whole milliseconds", () => {
  const r = resolveBookingLinkExpiry({
    departsAt,
    expiryHours: 24 * 7,
    rule: rule(1.5),
    now,
  });

  it("clamped to departure-90m", () =>
    expect(r.expiresAt).toEqual(new Date("2026-08-20T02:00:00.000Z")));
  it("no fractional ms", () => expect(r.expiresAt.getTime() % 1).toBe(0));
});

describe("Zero lead time — the cutoff is departure itself", () => {
  const r = resolveBookingLinkExpiry({
    departsAt,
    expiryHours: 24 * 7,
    rule: rule(0),
    now,
  });

  it("clamped to departure", () => expect(r.expiresAt).toEqual(departsAt));
});

describe("A sailing already inside its lead window yields a past expiry", () => {
  // The caller rejects on expiresAt <= now; prove it produces something in the
  // past rather than silently handing out a live link.
  const late = new Date("2026-08-20T02:00:00.000Z"); // 30 min inside a 2h lead
  const r = resolveBookingLinkExpiry({
    departsAt,
    expiryHours: 72,
    rule: rule(2),
    now: late,
  });

  it("expiry is before 'now'", () => expect(r.expiresAt < late).toBe(true));
  it("reports the clamp", () => expect(r.clampedToDeparture).toBe(true));
});
