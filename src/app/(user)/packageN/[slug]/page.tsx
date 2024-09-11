import Bounded from "@/components/elements/Bounded";
import PackageForm from "@/components/package/new-page/PackageForm";
import PackageFormN from "@/components/package/new-page/PackageFormN";
import PackageImageN from "@/components/package/new-page/PackageImageN";
import { PackageCarousel } from "@/components/packages/PackageCarousel";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getPackageById } from "@/db/data/dto/package";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import React from "react";

interface IPackagePage {
  params: {
    slug: string;
  };
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
    <Bounded>
      <div>
        <header className="ml-6 md:ml-9  text-white  flex flex-col  pt-3">
          <h1 className="text-xl md:text-3xl text-[#0D3A62] font-semibold">
            {data.title}
          </h1>
          <p className="text-primary">
            ({data.fromTime} - {data.toTime})
          </p>
        </header>
        <div className="mx-10 grid grid-cols-3 gap-2  rounded-2xl ">
          <div className="col-span-2  rounded-xl ">
            <PackageImageN data={data} />
          </div>
          <div className="col-span-1 bg-white rounded-xl ">
            <div>
              <PackageFormN
                adultPrice={data.adultPrice}
                childPrice={data.childPrice}
                packageId={data.id}
                packageCategory={data.packageCategory}
              />
            </div>
          </div>
        </div>
      </div>
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
      <div className="mt-4">
        <div className="flex mx-auto bg-white rounded-2xl overflow-hidden justify-between">
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
        </div>
      </div>
      <div className="mt-6 prose max-w-full w-full">
        <MDXRemote source={data.description} />
      </div>
      <PackageCarousel />
    </Bounded>
  );
}
