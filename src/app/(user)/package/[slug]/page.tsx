import Bounded from "@/components/elements/Bounded";
import ExclusivePackageEnquiryCard from "@/components/package/new-page/ExclusivePackageEnquiryCard";
import PackageAmmenties from "@/components/package/new-page/PackageAmmenties";
import PackageFormN from "@/components/package/new-page/PackageFormN";
import PackageImageN from "@/components/package/new-page/PackageImageN";
import { PackageCarousel } from "@/components/packages/PackageCarousel";
import { db } from "@/db";

import { getPackageById } from "@/db/data/dto/package";
import { constructMetadata } from "@/lib/helpers/constructMetadata";
import { cn, flattenObject } from "@/lib/utils";
import { isPackageStatusExclusive } from "@/lib/validators/Package";
import { Baby, Clock, PersonStanding, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import React from "react";

interface IPackagePage {
  params: {
    slug: string;
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
  return constructMetadata({
    MetaHeadtitle: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.canonicalUrl,
    },
    Ogimage: seo.ogImage,
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
export default async function PackagePage({ params: { slug } }: IPackagePage) {
  const data = await getPackageById({ slug });

  if (!data)
    return (
      <>
        <h1>Package doesn&apos;t Found</h1>
      </>
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
                {/* <div className="md:flex hidden items-center justify-center gap-2">
                
                </div> */}
              </div>
            </div>
          </div>
          {/* <div className="block md:hidden">
            <p className="text-blue-950 text-xs md:text-sm font-medium flex items-center gap-2 mt-1">
              <span className="text-primary">
                <Clock size="18" />
              </span>
              {data.fromTime} - {data.toTime}
            </p>
          </div> */}
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
                    Adult
                  </p>
                  <p className="text-blue-950 text-sm md:text-base font-medium flex items-center gap-2 mt-1">
                    ₹{data.adultPrice / 100}/-
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
        </header>

        <div className="grid md:gap-3  2md:grid-cols-3   ">
          <div className="2md:col-span-2 2md:row-start-1 2md:col-start-1">
            <PackageImageN data={data} />
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
              <PackageFormN
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

        <PackageCarousel />

        {/* <div className="flex mx-auto col-span-2 bg-white rounded-2xl overflow-hidden justify-between">
          <Card className="border-none bg-white">
            <CardHeader>
              <CardTitle> Reserve Your Spot Today!</CardTitle>
              <CardDescription className="max-w-2xl w-full">
                Embark on a unique and entertaining
                <span className="font-medium text-black"> {data.title} </span>
                that combines scenic views, great food, and live performances,
                all while sailing through the tranquil Arabian Sea.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger className={cn(buttonVariants(), "")}>
                  Book your Seats Now
                </DialogTrigger>
                <DialogContent>
                  <PackageForm
                    adultPrice={data.adultPrice}
                    childPrice={data.childPrice}
                    packageId={data.id}
                    packageCategory={data.packageCategory}
                  />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          <div className="max-w-sm ">
            <Image
              src={data.packageImage[0].image.url}
              alt={data.packageImage[0].image.alt}
              width={1280}
              height={720}
              className="object-cover aspect-video"
            />
          </div>
        </div> */}
      </div>
      {/* <Bounded>
        <div className=" mt-6 rounded-2xl px-4 py-6   ">
          <div className="max-w-4xl mx-auto w-full">
            <h4 className="text-2xl font-bold ">Amenities</h4>
            <p className="text-sm text-muted-foreground">
              Enjoy a variety of thoughtfully curated services and features,
              including dining, entertainment, and leisure activities, all
              designed to make your experience comfortable and memorable. Each
              package offers unique amenities to suit your preferences.
            </p>
            <div className="grid md:grid-cols-2 place-content-center gap-y-4 mt-3   ">
              {data.amenities.description.map((item, i) => {
                return (
                  <p key={`${item}-${i}`} className="flex items-center gap-2  ">
                    <CheckCircle2 className="w-5 h-5  stroke-red-500" />
                    <span>{item}</span>
                  </p>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-4"></div>
        <div className="mt-6 prose max-w-full w-full">
          <MDXRemote source={data.description} />
        </div>
        <PackageCarousel />
      </Bounded> */}
    </Bounded>
  );
}
