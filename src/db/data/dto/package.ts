import { db } from "@/db";
import { TPackageNavigation } from "@/db/types/TPackage";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";
import { Package, Image, PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function getPackageNavigation(): Promise<
  TPackageNavigation[] | null
> {
  try {
    const data = await db.package.findMany({
      select: {
        slug: true,
        title: true,
        id: true,
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
