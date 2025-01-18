import { prismaMock } from "@/test-utils/prisma/singleton";

export async function findBookingById(bookingId: string) {
    try {
      const data = await prismaMock.booking.count({
        where: {
          id: bookingId,
        },
      });
      if (!data) return false;
      return true;
    } catch (error) {
      console.error(error);
      return null;
    }
  }