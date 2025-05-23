import React from "react";
import { galleryImageUrl } from "@/constants/home/landingData";
import Image from "next/image";
import { EmblaCarouselProvider } from "@/components/Carousel/EmblaCarousel";
import Bounded from "@/components/elements/Bounded";
import { HomeCarousalProvider } from "../Carousel/HomeCarousal";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export default function GalleryCarousel() {
  return (
    <Bounded className="my-20 ">
      <h2 className="text-3xl md:text-4xl text-center text-red-700 font-medium">
        Gallery
      </h2>
      <h3 className="text-4xl md:text-5xl text-center font-normal">
        Explore Our <span className="text-[#0D3A62] font-semibold">Cruise</span>
      </h3>
      <div className="  mx-auto relative rounded-lg  ">
        <HomeCarousalProvider>
          {galleryImageUrl.map((item, i) => (
            <div key={item.url + i} className="first-of-type:ml-4">
              <Image
                src={item.url}
                alt={item.alt}
                width={1000}
                height={400}
                className="  rounded-lg aspect-video object-cover max-w-[45rem] "
              />
            </div>
          ))}
        </HomeCarousalProvider>
      </div>
      <div className="flex items-center justify-center w-full">
        <Link
          href={"/gallery/family-gathering"}
          className={buttonVariants({
            size: "sm",
            variant: "ghost",
          })}
        >
          View all our Gallery here -{'>'}
        </Link>
      </div>
    </Bounded>
  );
}
