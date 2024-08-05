import { db } from "@/db";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";

export async function getAllBookingDataFromToday()  {
  try {
    const data = await db.schedule.findMany({
      where: {
        day: {
          gte: new Date(Date.now()),
        },
      },
      select: {
        Booking: {
            select: {
                description: true,
                numOfAdults: true,
                numOfBaby: true,
                numOfChildren: true,
                user: {
                    select: {
                        email: true,
                        contact: true,

                    }
                },
                payment: {
                    select: {
                        advancePaid: true,
                        discount: true,
                        modeOfPayment: true,
                        totalAmount: true,
                    }
                }
            }
        },
      },
    });

    if (!data) {
      return null;
    }

    return data;
  } catch (error) {
    ErrorLogger(error)
    return null
  }
};
