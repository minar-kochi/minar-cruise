import "server-only";
import { db } from "@/db";
import { Image } from "@prisma/client";
import { notFound } from "next/navigation";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";

export async function getPackageImages({
  packageId,
}: {
  packageId: string;
}): Promise<Image[] | null> {
  try {
    const data = await db.image.findMany({
      where: {
        packageId: packageId,
      },
    });
    if (!data.length) {
      return null;
    }
    return data;
  } catch (error) {
    ErrorLogger(error);
    return null;
  }
}

export async function getManyGenericImages({
  type,
  id,
}: {
  id: string;
  type: "packageId";
}): Promise<Image[] | null> {
  try {
    const data = await db.image.findMany({
      where: {
        [type]: id,
      },
    });
    if (!data.length) {
      return null;
    }
    return data;
  } catch (error) {
    ErrorLogger(error);
    return null;
  }
}
