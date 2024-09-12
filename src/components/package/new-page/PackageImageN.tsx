

import React from "react";
import ProductCarousalIndexProvider from "./ProductCarousalContextProvider";
import ProductCarousalProvider from "./ProductCarousalProvider";
import Image from "next/image";
import ProductCarousalThumbButton from "./ProductCarousalThumbButton";
import { TGetPackageById } from "@/db/data/dto/package";

export default function PackageImageN({ data }: { data: TGetPackageById }) {
  return (
    <div className="h-full mx-auto  rounded-md overflow-hidden max-w-md md:max-w-full">
      <ProductCarousalIndexProvider>
        <div className="w-full  relative h-full ">
         
          <ProductCarousalProvider>
            {data.packageImage.map((item, index) => {
              return (
                <div
                  key={`${item.image.alt}-${item.image.id}-${index}`}
                  className="embla__slide   overflow-hidden aspect-square relative"
                >
                  <Image
                    alt={item.image.alt}
                    src={item.image.url}
                    className="slider-product top-0 rounded-xl w-full h-full object-contain lg:max-h-[calc(100vh-65px)]"
                    width={2148}
                    height={1596}
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
