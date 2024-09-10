import { ORGANIZED_PACKAGE_KEY } from "@/constants/CacheKeys/package";
import { db } from "@/db";
import { TPackageNavigation } from "@/db/types/TPackage";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";
import { isProd } from "@/lib/utils";
import {
  isPackageStatusBreakfast,
  isPackageStatusCustom,
  isPackageStatusDinner,
  isPackageStatusExclusive,
  isPackageStatusLunch,
  isPackageStatusSunSet,
} from "@/lib/validators/Package";
import { $Enums } from "@prisma/client";
import assert from "assert";
import { error } from "console";
import { revalidateTag, unstable_cache } from "next/cache";
import { afterEach } from "node:test";

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
      where: {
        packageCategory: {
          not: "CUSTOM",
        },
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

export type TGetPackageDetails = Exclude<Awaited<ReturnType<typeof getPackageDetails>>, null>
export type TAmenities = TGetPackageDetails["amenities"]
export type TBookingDateSelector = Pick<TGetPackageDetails, 'adultPrice' | 'childPrice' | 'packageCategory' | 'id' | 'title'> 
export async function getPackageDetails(slug: string) {
  try {
    
    const data = await db.package.findUnique({
      where: {
      slug 
    },
    select: {
      id: true,
      adultPrice: true,
      packageCategory: true,
      title: true,
      description: true,
      amenitiesId: true,
      duration: true,
      fromTime: true,
      toTime: true,
      childPrice: true,
      amenities: {
        select: {
          description: true
        }
      }
    },
  })
  
  return data
} catch (error) {
  console.log(error)
  return null
}
}

export type TGetPackageById = Exclude<
  Awaited<ReturnType<typeof getPackageById>>,
  null
>;

export async function getPackageById({ slug }: { slug: string }) {
  try {
    const data = await db.package.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        // packageTime: true,
        adultPrice: true,
        packageCategory: true,
        title: true,
        description: true,
        amenitiesId: true,
        duration: true,
        fromTime: true,
        toTime: true,
        childPrice: true,
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
    console.log(error);
    return null;
  }
}

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
            ImageUse: "PROD_FEATURED",
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
  title: string;
  duration: number;
  slug: string;
  packageCategory: $Enums.PACKAGE_CATEGORY;
};

export const getOrganizedPackages = unstable_cache(
  async () => {
    try {
      const data = await db.package.findMany({
        select: {
          slug: true,
          title: true,
          id: true,
          packageCategory: true,
          duration: true,
        },
      });
      if (!data.length) {
        return null;
      }

      let lunch: PackageSelect[] = [];
      let dinner: PackageSelect[] = [];
      let breakfast: PackageSelect[] = [];
      let sunset: PackageSelect[] = [];
      let custom: PackageSelect[] = [];

      for (const PackageData of data) {
        if (
          isPackageStatusLunch({
            packageStatus: PackageData.packageCategory,
            exlcusive: true,
          })
        ) {
          lunch.push(PackageData);
        }
        if (
          isPackageStatusSunSet({
            packageStatus: PackageData.packageCategory,
            exlcusive: true,
          })
        ) {
          sunset.push(PackageData);
        }
        if (
          isPackageStatusBreakfast({
            packageStatus: PackageData.packageCategory,
            exlcusive: true,
          })
        ) {
          breakfast.push(PackageData);
        }
        if (
          isPackageStatusDinner({
            packageStatus: PackageData.packageCategory,
            exlcusive: true,
          })
        ) {
          dinner.push(PackageData);
        }
        if (isPackageStatusCustom(PackageData.packageCategory)) {
          custom.push(PackageData);
        }
      }

      if (lunch?.length < 0 || dinner?.length < 0 || breakfast?.length < 0) {
        return null;
      }

      return {
        lunch,
        dinner,
        sunset,
        breakfast,
        custom,
      };
    } catch (error) {
      ErrorLogger(error);
      return null;
    }
  },
  ["ORGANIZED_PACKAGE_KEY"],
  {
    tags: ORGANIZED_PACKAGE_KEY,
  },
);

export type TGetPackageCardDetails = Exclude<
  Awaited<ReturnType<typeof getPackageCardDetails>>,
  null
>;
export type TAmenitiesGetPackageCardDetails = TGetPackageCardDetails[number]['amenities']
export async function getPackageCardDetails() {
  try {
    const data = await db.package.findMany({
      where: {
        packageCategory: {
          not: "CUSTOM",
        },
      },
      select: {
        id: true,
        adultPrice: true,
        childPrice:true,
        title: true,
        amenities: {
          select: {
            description: true
          }
        },
        packageImage: {
          take: 1,
          where: {
            ImageUse: "PROD_FEATURED",
          },
          select: {
            image: {
              select: {
                url: true,
                alt: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      if (!isProd) {
        console.log("getPackageCardDetails fetch failed");
      }
      return null;
    }

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function findPackageByIdExcludingCustomAndExclusive(
  packageId: string,
) {
  try {
    const packageFound = await db.package.findFirst({
      where: {
        id: packageId,
        packageCategory: {
          notIn: ["CUSTOM", "EXCLUSIVE"],
        },
      },
    });
    return packageFound;
  } catch (error) {
    return null;
  }
}
export type TFindPackageByIdExcludingCustomAndExclusive = Exclude<
  Awaited<ReturnType<typeof findPackageByIdExcludingCustomAndExclusive>>,
  null
>;
export type TGetPackagesForBlog = Exclude<
  Awaited<ReturnType<typeof getPackagesForBlog>>,
  null
>;

export async function getPackagesForBlog() {
  try {
    const data = await db.package.findMany({
      where: {
        packageCategory: {
          not: "CUSTOM",
        },
      },
      select: {
        id: true,
        adultPrice: true,
        title: true,
        slug: true,
        packageImage: {
          take: 1,
          where: {
            ImageUse: "PROD_FEATURED",
          },
          select: {
            image: {
              select: {
                url: true,
                alt: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      if (!isProd) {
        console.log("getPackagesForBlog fetch failed");
      }
      return null;
    }

    return data;
  } catch (error) {
    ErrorLogger(error);
    return null;
  }
}

export type TGetPackageAllImage = Awaited<
  ReturnType<typeof getPackageAllImage>
>;
export type ExcludeNullTgetPackageAllImage = Exclude<TGetPackageAllImage, null>;
export type TSingularTGetPackageAllImage =
  ExcludeNullTgetPackageAllImage["packageImage"][number];
export const getPackageAllImage = async (id: string) => {
  try {
    const data = await db.package.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
        packageImage: {
          include: {
            image: true,
          },
        },
      },
    });

    if (!data || !data?.packageImage) return null;
    return data;
  } catch (error) {
    return null;
  }
};

export async function getPackageTimeAndDuration(id: string) {
  try {
    const packageDetails = await db.package.findFirst({
      where: {
        id,
      },
      select: {
        title:true,
        duration: true,
        fromTime: true,
      },
    });
    return packageDetails;
  } catch (error) {
    return null;
  }
}

export type TGetPackageTimeAndDuration = Exclude<Awaited<ReturnType<typeof getPackageTimeAndDuration>>,null>
