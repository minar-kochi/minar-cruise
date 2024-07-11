import { PrismaClient } from "@prisma/client";

import {
  amenities,
  booking,
  foodMenu,
  image,
  packageImage,
  packages,
  schedule,
  users,
} from "./data";
import {
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
interface IIterateTable {
  tables?: TdbSchema[];
}
type TdbSchema =
  | "package"
  | "amenities"
  | "booking"
  | "foodMenu"
  | "image"
  | "schedule"
  | "user";

const dbSchema: TdbSchema[] = [
  "package",
  "amenities",
  "booking",
  "foodMenu",
  "image",
  "schedule",
  "user",
];
const db = new PrismaClient();

async function main() {
  console.log("Checking seed");
  const isDataPresent = await iterateTable({});

  if (isDataPresent) {
    throw new Error("Please reset/migrate database before you seed");
  }

  console.log("Seeding Data");

  const data = await db.$transaction(async (tx) => {
    try {
      // await Promise.all([

        await tx.user.createMany({
          data: users,
        });
        
        await tx.amenities.createMany({
          data: amenities,
        });
        await tx.foodMenu.createMany({
          data: foodMenu,
        });
        
        await tx.image.createMany({
          data: image,
        });

        await tx.package.createMany({
          data: packages,
        });
          
        await tx.packageImage.createMany({
          data: packageImage,
        });
        await tx.schedule.createMany({
          data: schedule,
        });
        await tx.booking.createMany({
          data: booking,
        });
      // ]);
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        console.log("Client validation Error");
        console.log("Issue:", error.message);
        return;
      }
      if (error instanceof PrismaClientUnknownRequestError) {
        console.log("Unknown client Request error");
        console.log(error.message);
        return;
      }
      if (error instanceof PrismaClientKnownRequestError) {
        console.log("Known client Request error");
        console.log(error.message);
        return;
      }
      if (error instanceof PrismaClientRustPanicError) {
        console.log("Prisma Engine Panic Error");
        console.log(error.message);
        return;
      }
      console.log(error);
      return false;
    }
    return true;
  });
  if (!data) console.log("Data failed to load");
}

main();


/**The TS Ignore is to represent that the [item] is passed as arguments and the typescript is not not smart enough to understand that 
 * the count func is not there.
 * soo make sure to add @ts-ignore to the db[item].count
 * 
   */
async function iterateTable({ tables = dbSchema }: IIterateTable) {
  let data = 
    (//@ts-ignore
      (await Promise.all([...tables.map((item) => db[item].count())])) as (
        | number
        | null
      )[]
    ).filter(Boolean);
  return data.length > 0;
}
