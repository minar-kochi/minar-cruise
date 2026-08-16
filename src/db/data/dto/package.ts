import { ORGANIZED_PACKAGE_KEY } from "@/constants/CacheKeys/package";
import {
  packageBookingRuleSelect,
  publicAmenitiesSelect,
  visibleAmenityItemsSelect,
  withPackageAmenityDescriptions,
  withPackageBookingRule,
} from "./amenities";
import { getBookingConfig } from "@/lib/helpers/config/getBookingConfig";
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
          notIn: ["CUSTOM"],
        },
        isVisible: true,
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
        fromTime: true,
        toTime: true,
        // Needed by callers that resolve a schedule's startsAt/endsAt at write
        // time (deriveScheduleInstants). Selecting them here rather than at each
        // call site keeps the "what does a writer need to know about a package"
        // answer in one place.
        startMinutesIst: true,
        duration: true,
      },
    });
    if (!data) return null;
    return data;
  } catch (error) {
    console.log("Something went Wrong", error);
    return null;
  }
}

export type TGetPackageDetails = Exclude<
  Awaited<ReturnType<typeof getPackageDetails>>,
  null
>;
export type TAmenities = TGetPackageDetails["amenities"];
export type TBookingDateSelector = Pick<
  TGetPackageDetails,
  "adultPrice" | "childPrice" | "packageCategory" | "id" | "title"
>;
export async function getPackageDetails(slug: string) {
  try {
    const data = await db.package.findUnique({
      where: {
        slug,
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
        amenities: { select: visibleAmenityItemsSelect },
      },
    });

    return data ? withPackageAmenityDescriptions(data) : data;
  } catch (error) {
    console.log(error);
    return null;
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
        packageCategory: { not: "CUSTOM" },
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
        amenities: { select: publicAmenitiesSelect },
        food: true,
        slug: true,
        isVisible: true,
        ...packageBookingRuleSelect,
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
    const defaults = await getBookingConfig();
    return withPackageBookingRule(
      withPackageAmenityDescriptions(data),
      defaults,
    );
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
      /**
       * CUSTOM is excluded to match every other public read — the nav
       * (`getPackageNavigation`), the package page (`getPackageById`) and its
       * `generateStaticParams` all drop it. /search was the one surface that
       * did not, so "Custom Packages" appeared as a bookable card whose "View
       * package" link resolved to "Package not found!".
       */
      where: { isVisible: true, packageCategory: { not: "CUSTOM" } },
      select: {
        id: true,
        title: true,
        slug: true,
        adultPrice: true,
        childPrice: true,
        amenities: { select: publicAmenitiesSelect },
        description: true,
        duration: true,
        fromTime: true,
        toTime: true,
        packageCategory: true,
        ...packageBookingRuleSelect,
        packageImage: {
          take: 2,
          where: {
            ImageUse: {
              in: ["PROD_FEATURED", "PROD_THUMBNAIL", "COMMON"],
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
    const defaults = await getBookingConfig();
    return data.map((item) =>
      withPackageBookingRule(withPackageAmenityDescriptions(item), defaults),
    );
  } catch (error) {
    return null;
  }
}

export const cachedSearchPackage = unstable_cache(
  getPackageSearchItems,
  undefined,
  {
    revalidate: 9600,
    // Was the literal string "ORGANIZED_PACKAGE_KEY" while getOrganizedPackages
    // below tags itself with the constant's *value* ("organized-package-schedule").
    // They were two different tags, so busting one never cleared the other.
    tags: ORGANIZED_PACKAGE_KEY,
  },
);

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
        where: { isVisible: true },
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
            exclusive: true,
          })
        ) {
          lunch.push(PackageData);
        }
        if (
          isPackageStatusSunSet({
            packageStatus: PackageData.packageCategory,
            exclusive: true,
          })
        ) {
          sunset.push(PackageData);
        }
        if (
          isPackageStatusBreakfast({
            packageStatus: PackageData.packageCategory,
            exclusive: true,
          })
        ) {
          breakfast.push(PackageData);
        }
        if (
          isPackageStatusDinner({
            packageStatus: PackageData.packageCategory,
            exclusive: true,
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
export type TAmenitiesGetPackageCardDetails =
  TGetPackageCardDetails[number]["amenities"];
export async function getPackageCardDetails() {
  try {
    const data = await db.package.findMany({
      where: {
        packageType: "normal",
        isVisible: true,
      },
      select: {
        id: true,
        adultPrice: true,
        childPrice: true,
        title: true,
        packageCategory: true,
        fromTime: true,
        toTime: true,
        slug: true,
        amenities: { select: visibleAmenityItemsSelect },
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

    return data.map(withPackageAmenityDescriptions);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export type TGetNormalPackageCard = Exclude<
  Awaited<ReturnType<typeof getNormalPackageCard>>,
  null
>;

export async function getNormalPackageCard() {
  try {
    const data = await db.package.findMany({
      where: {
        packageType: "normal",
        isVisible: true,
      },
      select: {
        id: true,
        slug: true,
        adultPrice: true,
        title: true,
        duration: true,
        packageImage: {
          where: {
            ImageUse: "PROD_FEATURED",
          },
          select: {
            image: {
              select: {
                id: true,
                alt: true,
                url: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      if (!isProd) {
        console.log("getNormalPackageCard fetch failed");
      }
      return null;
    }

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export type TGetSpecialPackageCard = Exclude<
  Awaited<ReturnType<typeof getSpecialPackageCard>>,
  null
>;

export async function getSpecialPackageCard() {
  try {
    const data = await db.package.findMany({
      where: {
        packageType: "special",
        isVisible: true,
      },

      select: {
        id: true,
        adultPrice: true,
        slug: true,
        title: true,
        duration: true,
        packageImage: {
          where: {
            ImageUse: "PROD_FEATURED",
          },
          select: {
            image: {
              select: {
                id: true,
                alt: true,
                url: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      if (!isProd) {
        console.log("getSpecialPackageCard fetch failed");
      }
      return null;
    }

    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Resolves a package the public is allowed to pay for.
 *
 * `allowHidden` exists because "hidden" means two different things depending on
 * who is asking. For a visitor it must mean unbookable, or hiding a package
 * would drop it from every listing while its booking endpoint stayed open. For
 * a booking link an admin already issued it must NOT — the sale was agreed
 * before the package was hidden, and expiring those links silently would strand
 * paying customers. Hence: closed by default, opened only by the link flow.
 */
export async function findPackageByIdExcludingCustomAndExclusive(
  packageId: string,
  { allowHidden = false }: { allowHidden?: boolean } = {},
) {
  try {
    const packageFound = await db.package.findFirst({
      where: {
        id: packageId,
        packageCategory: {
          notIn: ["CUSTOM", "EXCLUSIVE"],
        },
        ...(allowHidden ? {} : { isVisible: true }),
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
          notIn: ["CUSTOM", "EXCLUSIVE"],
        },
        isVisible: true,
      },
      select: {
        id: true,
        adultPrice: true,
        childPrice: true,
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
            image: {
              select: {
                alt: true,
                id: true,
                fileKey: true,
                ImageUse: true,
                url: true,
              },
            },
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
        title: true,
        duration: true,
        fromTime: true,
        // The order.paid webhook creates a Schedule and must resolve its
        // startsAt/endsAt in the same transaction — a paid sailing with no
        // departure instant would be invisible to every instant-based query.
        startMinutesIst: true,
      },
    });
    return packageDetails;
  } catch (error) {
    return null;
  }
}

export type TGetPackageTimeAndDuration = Exclude<
  Awaited<ReturnType<typeof getPackageTimeAndDuration>>,
  null
>;
