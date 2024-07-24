import { db } from "@/db";
import { TPackageNavigation } from "@/db/types/TPackage";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";
import { isProd } from "@/lib/utils";
import { $Enums } from "@prisma/client";
import assert from "assert";

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

export async function getPackageByIdWithStatusAndCount(id: string) {
  try {
    const data = await db.package.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        packageCategory: true,
      },
    });
    if (!data) return null;
    return data;
  } catch (error) {
    console.log("Something went Wrong", error);
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

export type TGetPackageSearchItems = Exclude<
  Awaited<ReturnType<typeof getPackageSearchItems>>,
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
                ImageUse: true,
              },
            },
          },
        },
      },
    });

    if (!data.length) {
      if (!isProd) {
        console.log("Failed to load package details");
      }
      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
}

export type PackageSelect = {
  id: string;
  slug: string;
  title: string;
  packageCategory: $Enums.PACKAGE_CATEGORY;
};

export async function getPackageScheduleDatas() {
  try {
    const data = await db.package.findMany({
      select: {
        slug: true,
        title: true,
        id: true,
        packageCategory: true,
      },
    });
    if (!data.length) {
      return null;
    }

    let Lunch: PackageSelect[] = [];
    let Dinner: PackageSelect[] = [];
    let BreakFast: PackageSelect[] = [];
    let Custom: PackageSelect[] = [];

    for (const PackageData of data) {
      if (
        PackageData.packageCategory === "LUNCH" ||
        PackageData.packageCategory === "EXCLUSIVE"
      ) {
        Lunch.push(PackageData);
      }
      if (
        PackageData.packageCategory === "BREAKFAST" ||
        PackageData.packageCategory === "EXCLUSIVE"
      ) {
        BreakFast.push(PackageData);
      }
      if (
        PackageData.packageCategory === "DINNER" ||
        PackageData.packageCategory === "EXCLUSIVE"
      ) {
        Dinner.push(PackageData);
      }
      if (PackageData.packageCategory === "EXCLUSIVE") {
        Custom.push(PackageData);
      }
    }
    if (Lunch?.length < 0 && Dinner?.length < 0 && BreakFast?.length < 0) {
      return null;
    }
    return {
      Lunch,
      Dinner,
      BreakFast,
      Custom,
    };
  } catch (error) {
    ErrorLogger(error);
    return null;
  }
}

export type TgetPackageScheduleDatas = Awaited<
  ReturnType<typeof getPackageScheduleDatas>
>;
