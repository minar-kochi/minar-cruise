import { db } from "@/db";
import { TPackageNavigation } from "@/db/types/TPackage";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";

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

export async function getPackageById({ id }: { id: string }) {
  try {
    const data = await db.package.findUnique({
      where: {
        slug: id,
      },
      select: {
        id: true,
        adultPrice: true,
        title: true,
        description: true,
        amenitiesId: true,
        packageImage: {
          select: {
            image: {
              select: {
                packageImage: true,
                url: true,
                id: true,
                alt: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      console.log("Failed to load package details");
      return null;
    }
    return data;
  } catch (error) {
    // ErrorLogger(error);
    return null;
  }
}

export type TGetPackageById = Exclude<
  Awaited<ReturnType<typeof getPackageById>>,
  null
>;

export async function getPackageSearchItems() {
  try {
    const data = await db.package.findMany({
      select: {
        id: true,
        title: true,
        packageImage: {
          take: 1,
          where: {
            image: {
              ImageUse: {
                has: "PROD_FEATURED",
              },
            },
          },
          select: {
            image: {
              select: {
                url: true,
                alt: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      if (process.env.NODE_ENV === "development") {
        console.log("Failed to load package details");
      }
      return null;
    }
    return data;
    
  } catch (error) {
    return null;
  }
}
