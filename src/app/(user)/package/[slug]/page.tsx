import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";
import Bounded from "@/components/elements/Bounded";
import ExclusivePackage from "@/components/home/ExclusivePackage";
import Services from "@/components/home/Services";
import ExclusivePackageEnquiryCard from "@/components/package/new-page/ExclusivePackageEnquiryCard";
import PackageAmmenties from "@/components/package/new-page/PackageAmmenties";
import PackageForm from "@/components/package/new-page/PackageForm";
import PackageImage from "@/components/package/new-page/PackageImage";
import { PackageCarousel } from "@/components/packages/PackageCarousel";
import TermsAndConditionsCard from "@/components/packages/TermsAndConditionsCard";
import { CONSTANTS } from "@/constants/data/assets";
import { db } from "@/db";

import { getPackageById } from "@/db/data/dto/package";
import { constructMetadata } from "@/lib/helpers/constructMetadata";
import {
  cn,
  flattenObject,
  parseDateFormatYYYMMDDToNumber,
  parseSafeFormatYYYYMMDDToNumber,
} from "@/lib/utils";
import { isPackageStatusExclusive } from "@/lib/validators/Package";
import { Baby, Clock, PersonStanding, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";

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
        <header className="sm:px-10 mx-1 flex flex-col items-center justify-center md:grid md:grid-cols-2 bg-white rounded-md my-4  w-full  gap-4 pt-3 pb-3 ">
          <div className="flex gap-1 md:gap-3 bg-white">
            <Image
              src="/assets/titleicons/star.svg"
              alt="star icon"
              width={500}
              height={500}
              className="w-8 md:w-10  h-8 md:h-10 "
            />
            <div className="flex">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl text-[#0D3A62] font-semibold">
                  {data.title}
                </h1>
              </div>
            </div>
          </div>
          {!isPackageStatusExclusive(data.packageCategory) && (
            <div className="flex flex-col justify-center items-center">
              <div className="bg-white flex  gap-4 px-2 py-2">
                <div className="">
                  <div className="flex  gap-2 items-center ">
                    <User size="26" className="text-red-500" />
                    <p className="text-blue-950 text-sm md:text-base font-medium flex items-center gap-2 mt-1">
                      Adult
                    </p>
                    <p className="text-blue-950 text-sm md:text-base font-medium flex items-center gap-2 mt-1">
                      ₹{data.adultPrice / 100}/-
                    </p>
                  </div>
                </div>
                <div className="">
                  <div className="flex  gap-2 items-center ">
                    <Baby size="26" className="text-red-500" />
                    <p className="text-blue-950 text-sm md:text-base font-medium flex items-center gap-2 mt-1">
                      Child
                    </p>
                    <p className="text-blue-950 text-sm md:text-base font-medium flex items-center gap-2 mt-1">
                      ₹{data.childPrice / 100}/-
                    </p>
                  </div>
                </div>
              </div>
              <div className="">
                <p className="text-blue-950 text-sm md:text-base font-medium flex items-center gap-2 mt-1">
                  <span className="text-primary">
                    <Clock size="26" />
                  </span>
                  {data.fromTime} - {data.toTime}
                </p>
              </div>
            </div>
          )}
        </header>

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
        <PackageCarousel />
        <TermsAndConditionsCard />
      </div>
    </Bounded>
  );
}
