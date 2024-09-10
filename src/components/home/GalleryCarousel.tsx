import React from "react";
import { galleryImageUrl } from "@/constants/home/landingData";
import Image from "next/image";
import { EmblaCarouselProvider } from "@/components/Carousel/EmblaCarousel";
import Bounded from "@/components/elements/Bounded";

export default function GalleryCarousel() {
  return (
    <Bounded className="my-20 ">
      <h2 className="text-3xl md:text-4xl text-center text-red-700 font-medium">Gallery</h2>
      <h3 className="text-4xl md:text-5xl text-center font-normal">
        Explore Our <span className="text-[#0D3A62] font-semibold">Cruise</span>
      </h3>
      <div className="w-[95%]  mx-auto relative  rounded-lg">
        <EmblaCarouselProvider>
          {galleryImageUrl.map((url, i) => (
            <div key={url + i} className="">
              <Image
                src={url}
                alt="gallery image"
                width={1000}
                height={400}
                className="  rounded-lg aspect-video object-cover max-w-[45rem] "
              />
            </div>
          ))}
        </EmblaCarouselProvider>
      </div>
    </Bounded>
  );
}
