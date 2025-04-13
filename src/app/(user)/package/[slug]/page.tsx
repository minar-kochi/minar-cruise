import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";
import Bounded from "@/components/elements/Bounded";
import ExclusivePackage from "@/components/home/ExclusivePackage";
import Services from "@/components/home/Services";
import ExclusivePackageEnquiryCard from "@/components/package/new-page/ExclusivePackageEnquiryCard";
import PackageAmmenties from "@/components/package/new-page/PackageAmmenties";
import PackageForm from "@/components/package/new-page/PackageForm";
import PackageImage from "@/components/package/new-page/PackageImage";
import TermsAndConditionsCard from "@/components/packages/TermsAndConditionsCard";
import { CONSTANTS } from "@/constants/data/assets";
import { db } from "@/db";

import { getPackageById } from "@/db/data/dto/package";
import { constructMetadata } from "@/lib/helpers/constructMetadata";
import {
  cn,
  flattenObject,
  parseSafeFormatYYYYMMDDToNumber,
} from "@/lib/utils";
import { isPackageStatusExclusive } from "@/lib/validators/Package";
import { Baby, Clock, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import PackageHeader from "./package-header";
import PackageCarousalWrapper from "@/components/packages/PackageCarousalWrapper";

interface IPackagePage {
  params: {
    slug: string;
  };
  searchParams?: {
    selectedDate?: string;
  };
}
export const maxDuration = 25;
export async function generateMetadata({
  params: { slug },
}: IPackagePage): Promise<Metadata> {
  const packageMetadata = await db.package.findUnique({
    where: {
      slug,
    },
    select: {
      title: true,
      packageImage: {
        where: {
          ImageUse: "PROD_THUMBNAIL",
        },
        select: {
          image: {
            select: {
              url: true,
            },
          },
        },
      },
      PackageSeo: {
        select: {
          seo: true,
        },
      },
    },
  });
  if (!packageMetadata) {
    return constructMetadata({
      MetaHeadtitle: {
        default: "Packages",
        template: "| Minar Cruise",
      },
    });
  }
  const seo = packageMetadata.PackageSeo[0].seo;
  // console.log(seo.structuredData?.geo)
  const data = JSON.parse(JSON.stringify(seo.structuredData));
  let flatted: any;
  try {
    flatted = flattenObject(data);
  } catch (error) {
    flatted = {};
  }
  function Ogimage() {
    if (packageMetadata?.packageImage[0]?.image?.url) {
      return packageMetadata?.packageImage[0]?.image?.url;
    }
    if (seo.ogImage) {
      return seo.ogImage;
    }
    return CONSTANTS.DEFAULT.IMAGE_URL;
  }
  return constructMetadata({
    MetaHeadtitle: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    Ogimage: Ogimage(),
    robots: seo.metaRobots,
    other: flatted,
  });
}

export async function generateStaticParams() {
  const packageSlug = await db.package.findMany({
    where: {
      packageCategory: {
        not: "CUSTOM",
      },
    },
    select: {
      slug: true,
    },
  });

  return packageSlug.map((item) => ({
    slug: item.slug,
  }));
}
export default async function PackagePage({
  params: { slug },
  searchParams,
}: IPackagePage) {
  let parsedDate = parseSafeFormatYYYYMMDDToNumber(
    searchParams?.selectedDate ?? "",
  );

  const data = await getPackageById({ slug });

  if (!data)
    return (
      <Bounded>
        <HeaderTitleDescription
          title="Package not found!"
          description="We couldn't find the package you are looking for"
        />
      </Bounded>
    );
  return (
    <Bounded className="md:px-1 ">
      <div className="">
        <PackageHeader data={data} />

        <div className="grid md:gap-3  2md:grid-cols-3   ">
          <div className="2md:col-span-2 2md:row-start-1 2md:col-start-1">
            <PackageImage data={data} />
          </div>
          <div
            className={cn(
              "2md:row-span-2 2md:col-start-3 2md:row-start-1 2md:sticky 2md:-top-96 2md:self-start bg-white  rounded-lg ",
              {
                "2md-top-[500px]": isPackageStatusExclusive(
                  data.packageCategory,
                ),
              },
            )}
          >
            {!isPackageStatusExclusive(data.packageCategory) ? (
              <PackageForm
                defaultDate={parsedDate?.date ?? undefined}
                adultPrice={data.adultPrice}
                childPrice={data.childPrice}
                packageId={data.id}
                packageCategory={data.packageCategory}
              />
            ) : (
              <ExclusivePackageEnquiryCard />
            )}
          </div>

          <div className="2md:col-span-2 2md:row-start-2 2md:col-start-1">
            <PackageAmmenties data={data} />
          </div>
        </div>
        {isPackageStatusExclusive(data.packageCategory) && (
          <div>
            <Services />
            <ExclusivePackage />
          </div>
        )}

        <PackageCarousalWrapper />
        <TermsAndConditionsCard />
      </div>
    </Bounded>
  );
}
