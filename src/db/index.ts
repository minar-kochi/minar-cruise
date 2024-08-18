import { isProd } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

let prismaCliens = new PrismaClient().$extends({
  name: "extend-result-total-booking",
  result: {
    booking: {
      totalBooking: {
        needs: { numOfAdults: true, numOfBaby: true, numOfChildren: true },
        compute(data) {
          let sum = data.numOfAdults + data.numOfBaby + data.numOfChildren;
          return sum;
        },
      },
    },
  },
});

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: typeof prismaCliens;
}

let prisma: typeof prismaCliens;
if (isProd) {
  prisma = prismaCliens;
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = prismaCliens;
  }

  prisma = global.cachedPrisma;
}
export const db = prisma;
