import { PrismaClient } from "@prisma/client";
import { dbPackageSeo } from "../data/dbPackageSeo";
import { seoSeedData } from "../data/dbSeo";
import { CONSTANTS } from "@/constants/data/assets";

const db = new PrismaClient();
async function seedSeoIfEmpty() {
  await db.$connect();
  const isSeoFound = await db.seo.findFirst({
    select: {
      id: true,
    },
  });
  try {
    if (isSeoFound?.id) {
      throw new Error("SEO FOUND PLEASE CLEAR IT");
    }
  } catch (error) {
    console.error(error);
    process.exit();
  }

  const isPackageSeoFound = await db.packageSeo.findFirst({
    select: { id: true },
  });

  try {
    if (isPackageSeoFound?.id) {
      throw new Error("SEO FOUND PLEASE CLEAR IT");
    }
  } catch (error) {
    console.error(error);
    process.exit();
  }
  try {
    console.log("seeding seo");
    await db.$transaction(async (tx) => {
      await tx.seo.createMany({
        data: seoSeedData,
      });
      await tx.packageSeo.createMany({
        data: dbPackageSeo,
      });
    });
  } catch (error) {
    console.error(error);
    process.exit();
  }
}
async function updateSeoOgImageUrl() {
  await db.$connect();
  await db.seo.updateMany({
    data: {
      ogImage: CONSTANTS.DEFAULT.IMAGE_URL,
    },
  });
}
