"use client";
import { TGetPackageCardDetails } from "@/db/data/dto/package";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import PackageCard from "./PackageCard";

type PackageCarouselProps = {
  data: TGetPackageCardDetails;
  className?: string;
};

const PackageCarousel = ({ data, className }: PackageCarouselProps) => {
  const plugin = React.useMemo(
    () =>
      Autoplay({
        delay: 4000,
        stopOnInteraction: false, // This prevents stopping on user interaction
        stopOnMouseEnter: true, // Optional: stops on mouse enter
      }),
    [],
  );

  if (!data?.length) {
    return null;
  }

  return (
    <div className="w-full px-4 py-6">
      <Carousel
        opts={{
          align: "center", // Changed from 'start' to 'center' for better looping
          loop: true,
          dragFree: true, // Allows free-flowing drag
          skipSnaps: true, // Allows smooth transitions between slides
        }}
        plugins={[plugin]}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {data.map((item) => (
            <CarouselItem
              key={`${item.id}-package-carousal`}
              className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-[35%]"
            >
              <PackageCard
                fromTime={item.fromTime}
                toTime={item.toTime}
                PackageId={item.id}
                packageCategory={item.packageCategory}
                slug={item.slug}
                amenities={item.amenities}
                adultPrice={item.adultPrice}
                childPrice={item.childPrice}
                alt={item.packageImage[0]?.image.alt}
                title={item.title}
                url={item.packageImage[0]?.image.url}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-0 w-10 h-10 disabled:text-gray-500  bg-white hover:bg-white/80 -translate-x-1/2" />
          <CarouselNext className="right-0 w-10 h-10 bg-white disabled:text-gray-500 hover:bg-white/80 translate-x-1/2" />
        </div>
      </Carousel>
    </div>
  );
};

export default PackageCarousel;
