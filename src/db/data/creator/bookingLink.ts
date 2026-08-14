import "server-only";
import { db } from "@/db";
import { createBookingLinkToken } from "@/lib/helpers/bookingLink/token";
import { Prisma } from "@prisma/client";

const MAX_TOKEN_ATTEMPTS = 3;

/**
 * Create a booking link, regenerating the public token if it happens to
 * collide. Collisions are vanishingly unlikely at 10 cuid2 chars, but the
 * column is unique and a 500 on the admin's first click would be a poor way to
 * discover that.
 */
export async function createBookingLink(
  data: Omit<Prisma.BookingLinkUncheckedCreateInput, "token">,
) {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_TOKEN_ATTEMPTS; attempt++) {
    try {
      return await db.bookingLink.create({
        data: { ...data, token: createBookingLinkToken() },
      });
    } catch (error) {
      lastError = error;
      const isTokenCollision =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002" &&
        (error.meta?.target as string[] | undefined)?.includes("token");

      if (!isTokenCollision) throw error;
    }
  }

  throw lastError;
}
