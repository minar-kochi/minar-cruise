import React from "react";
import ProductCarousalIndexProvider from "./ProductCarousalContextProvider";
import ProductCarousalProvider from "./ProductCarousalProvider";
import Image from "next/image";
import ProductCarousalThumbButton from "./ProductCarousalThumbButton";
import { TGetPackageById } from "@/db/data/dto/package";

export default function PackageImage({ data }: { data: TGetPackageById }) {
  return (
    <div className="h-full mx-auto rounded-md overflow-hidden max-w-md md:max-w-full">
      <ProductCarousalIndexProvider>
        <div className="w-full relative h-full ">
          <header className= "ml-6 md:ml-9 absolute z-10 top-4  md:top-6 text-white  flex flex-col  pt-3">
            <h1 className="text-xl md:text-3xl font-medium">{data.title}</h1>
            <p className="text-primary">
              ({data.fromTime} - {data.toTime})
            </p>
          </header>
          <ProductCarousalProvider>
            {data.packageImage.map((item, index) => {
              return (
                <div
                  key={`${item.image.alt}-${item.image.id}-${index}`}
                  className="embla__slide   overflow-hidden aspect-square relative"
                >
                  <div className="absolute w-full h-full  bg-gradient-to-b from-black/85 to-black/0 z-20" />
                  <Image
                    alt={item.image.alt}
                    src={item.image.url}
                    className="slider-product h-full  border  w-full  object-cover"
                    width={1280}
                    height={720}
                  />
                </div>
              );
            })}
          </ProductCarousalProvider>
        </div>
        {/* <div className="flex  flex-wrap items-center justify-center gap-2">
          {data.packageImage.map((item, i) => {
            return (
              <div className="">
                <ProductCarousalThumbButton
                  index={i}
                  className="w-2 h-2 bg-black rounded-full"
                  CurrentIndexClass="bg-primary w-3 h-3"
                  key={`${item.image.id}-${item.image.url}-${i}`}
                >
                  <div />
                  <div className="flex items-center  justify-center rounded-2xl ">
                        <div className="w-2 h-2 rounded-full" />
                        </div>
                </ProductCarousalThumbButton>
              </div>
            );
          })}
        </div> */}
      </ProductCarousalIndexProvider>
    </div>
  );
}
