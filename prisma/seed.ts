import { PrismaClient } from "@prisma/client";
import { iterateTable } from "./functions/iterateTables";

import {
  amenities,
  booking,
  foodMenu,
  image,
  imageData,
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

import { exit } from "node:process";
import { ClearDb } from "./functions/utils";
import moment from "moment";
import { seoSeedData } from "./data/dbSeo";
import { dbPackageSeo } from "./data/dbPackageSeo";

const db = new PrismaClient();

async function main() {
  console.log("Checking seed");
  if (!process.env.DATABASE_URL?.includes("localhost")) {
    console.error("You are are on production");
    process.exit();
  }
  const isDataPresent = await iterateTable({});

  if (isDataPresent) {
    console.error("There is Existing data Found on the database \n");
    const isDeleted = await ClearDb();
    if (!isDeleted) {
      console.error("You need to reset/migrate database before you seed");
    }
  }
  const isData = await db.booking.findMany();
  console.log("Seeding Data");
  console.log("Is there data ?", isData);
  const data = await db.$transaction(async (tx) => {
    console.log("Opening Transaction...");
    try {
      // console.log("Inserting user...");

      // await tx.user.createMany({
      //   data: users,
      // });
      // console.log("Completed User \n");

      console.log("Inserting amenities...");
      await tx.amenities.createMany({
        data: amenities,
      });
      console.log("Completed amenities \n");

      console.log("Inserting foodMenu...");
      await tx.foodMenu.createMany({
        data: foodMenu,
      });
      console.log("Completed foodMenu \n");
      console.log("Inserting Seo...");

      await tx.seo.createMany({
        data: seoSeedData.map((item) => {
          return {
            canonicalUrl: item.canonicalUrl,
            description: item.description,
            metaRobots: item.metaRobots,
            ogDescription: item.ogDescription,
            ogImage: item.ogImage,
            ogTitle: item.ogTitle,
            title: item.title,
            keywords: item.keywords,
            id: item.id,
            structuredData: item.structuredData,
          };
        }),
      });

      console.log("Completed SEO \n");
      console.log("Inserting image...");

      await tx.image.createMany({
        data: await imageData,
      });
      console.log("Completed image \n");
      console.log("Inserting package...");

      await tx.package.createMany({
        data: packages,
      });
      console.log("Completed package \n");

      console.log("Inserting packageImage...");

      await tx.packageImage.createMany({
        data: packageImage,
      });
      await tx.packageSeo.createMany({
        data: dbPackageSeo,
      });
      console.log("Completed packageImage \n");

      console.log("Seeding completed!");
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
  if (!data) {
    console.log("Data failed to load");
    process.exit();
  }
  console.log("Transaction Completed");
  console.log("Data Injected Successfully");
  process.exit();
}

main();
