export const BOOKING_LINK_PATH = "/book";

/**
 * Absolute, shareable URL for a booking link.
 *
 * Deliberately not `absoluteUrl()` from lib/utils: that helper returns a bare
 * path when `window` is defined, which is correct for in-app navigation but
 * useless for something pasted into WhatsApp or encoded into a QR code. Always
 * build this on the server, where NEXT_PUBLIC_DOMAIN is authoritative.
 */
export function bookingLinkUrl(token: string): string {
  const origin = (
    process.env.NEXT_PUBLIC_DOMAIN ??
    `http://localhost:${process.env.PORT ?? 3000}`
  ).replace(/\/$/, "");

  return `${origin}${BOOKING_LINK_PATH}/${token}`;
}
