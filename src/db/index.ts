import { isProd } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

// let prismaCliens = new PrismaClient();

// declare global {
//   // eslint-disable-next-line no-var
//   var cachedPrisma: typeof prismaCliens;
// }

// let prisma: typeof prismaCliens;
// if (isProd) {
//   prisma = prismaCliens;
// } else {
//   if (!global.cachedPrisma) {
//     global.cachedPrisma = prismaCliens;
//   }

//   prisma = global.cachedPrisma;
// }
// export const db = prisma;

// import { neonConfig, Pool } from "@neondatabase/serverless";
// import { PrismaNeon } from "@prisma/adapter-neon";
// import ws from "ws";
// neonConfig.webSocketConstructor = ws;
// const connectionString = `${process.env.DATABASE_URL}`;
// const pool = new Pool({ connectionString,log(...messages) {
//   console.log(messages)
// },   });
// const adapter = new PrismaNeon(pool);

const prismaClientSingleton = () => {
  return new PrismaClient().$extends({
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
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
