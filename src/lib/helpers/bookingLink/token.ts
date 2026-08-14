import { init } from "@paralleldrive/cuid2";

/**
 * Public token for a booking link — the `abc123` in /book/abc123.
 *
 * cuid2 rather than nanoid: cuid2 is already used for the pre-generated
 * bookingId that rides in the Razorpay order notes, and nanoid@5 is ESM-only.
 *
 * 10 chars of cuid2 is ~50 bits of entropy. These are shared over WhatsApp and
 * read aloud over the phone, so length is a UX constraint as much as a security
 * one; guessing is further blunted by the link being single-use and expiring.
 */
export const createBookingLinkToken = init({ length: 10 });

/** Mirrors the shape produced above — used by the public route validator. */
export const BOOKING_LINK_TOKEN_REGEX = /^[a-z0-9]{8,32}$/;
