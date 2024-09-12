import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import React from "react";
import PackageFormN from "./PackageFormN";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PackageCarousel } from "@/components/packages/PackageCarousel";
import { TGetPackageById } from "@/db/data/dto/package";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function PackageAmmenties({ data }: { data: TGetPackageById }) {
  return (
    <div>
      <div className="rounded-2xl px-4 pt-16 pb-8 ">
        <div className="max-w-4xl mx8uto w-full">
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
                  <PackageFormN
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
    </div>
  );
}
