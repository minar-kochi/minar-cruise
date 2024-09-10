import { getSpecialPackageCard } from "@/db/data/dto/package";
import React from "react";
import SpecialPackageCard from "./SpecialPackageCard";
import ReachOutToUs from "./ReachOutToUs";

export default async function SpecialPackages() {
  const specialData = await getSpecialPackageCard();
  if (!specialData) {
    console.log("could nt receive specialData");
    return null;
  }
  return (
    <div className="w-full ">
      <h3 className=" text-[#194266] text-2xl md:text-3xl font-semibold  mt-4 mb-2 ">
        Special Cruises with Dining & Entertainment
      </h3>
      <p className="text-sm text-muted-foreground tracking-wider my-3   w-[90%] ">
        Enjoy extended 3+ hour cruises featuring stunning sunsets, delightful
        lunches, or scenic dinners. Each cruise offers gourmet meals, live
        music, fun-filled entertainment, and DJ performances, perfect for a
        memorable time on the Arabian Sea.
      </p>
      <div className="w-full flex flex-col items-center lg:flex-row lg:justify-between max-xl:gap-5 flex-wrap">
        {specialData.map((item, i) => {
          return (
            <SpecialPackageCard
              key={`${item.id}${i}`}
              alt={item.packageImage[0].image.alt}
              title={item.title}
              url={item.packageImage[0].image.url}
              slug={`/booking/${item.slug}`}
              adultPrice={item.adultPrice}
              duration={item.duration}
            />
          );
        })}
      </div>
      <div className="block w-full h-[150px] mt-4  lg:hidden">
        <ReachOutToUs />
      </div>
    </div>
  );
}
