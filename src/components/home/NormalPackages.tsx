import { getNormalPackageCard } from "@/db/data/dto/package";
import React from "react";
import PackageCard from "./PackageCard";
import ReachOutToUs from "./ReachOutToUs";

export default async function NormalPackages() {
  const normalData = await getNormalPackageCard();
  if (!normalData) {
    console.log("could nt receive normalData");
    return null;
  }
  return (
    <div className="w-[100%] ">
      <div className="relative ">
        {/* <h3 className=" text-[#194266] font-medium text-xs my-2 ">
        2-Hour Scenic Cruises with Meals & Entertainment
      </h3> */}
      </div>
      <div className="w-full lg:flex-row flex gap-4 items-center flex-col-reverse ">
        <div className=" w-full lg:w-[60%] gap-5 grid grid-cols-[repeat(auto-fit,_minmax(256px,_1fr))] md:grid-cols-2 items-center place-items-center overflow-hidden rounded-xl ">
          {normalData.map((item, i) => {
            return (
              <PackageCard
                key={`${item.id}${i}`}
                className=""
                alt={item.packageImage[0].image.alt}
                title={item.title}
                url={item.packageImage[0].image.url}
                slug={`/package/${item.slug}`}
                adultPrice={item.adultPrice}
                duration={item.duration}
              />
            );
          })}
        </div>
        <div className="lg:w-[40%] h-full gap-10 flex flex-col items-center justify-center ">
          <div>
            <h3 className="text-[#194266] text-2xl md:text-3xl font-semibold lg:text-center ">
              2-Hour Scenic Cruises with Meals & Entertainment
            </h3>
            <p className="mt-2 lg:mb-4 text-muted-foreground lg:font-medium lg:text-center text-sm tracking-wider  ">
              Explore Cochin&apos;s Arabian Sea with our 2-hour cruises,
              offering meals, live music, entertainment, and DJ performances.
              Ideal for unforgettable moments with loved ones!
            </p>
          </div>
          <div className="hidden lg:flex ">
            <ReachOutToUs />
          </div>
        </div>
      </div>
    </div>
  );
}
