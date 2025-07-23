import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";
import BookNowBtn from "./BookNowBtn";
import { Button } from "../ui/button";
import Link from "next/link";

interface IPackageCard {
  url: string;
  alt: string;
  title: string;
  className?: string;
  slug: string;
  adultPrice: number;
  duration: number;
}

export default function PackageCard({
  alt,
  url,
  title,
  className,
  slug,
  duration,
  adultPrice,
}: IPackageCard) {
  return (
    <Link
      className="relative w-full max-w-[380px] h-[18rem] group rounded-md overflow-hidden  transition-transform group duration-300"
      href={slug}
    >
      {/*  */}
      <div className="absolute  inset-0 z-10 bg-gradient-to-t from-black/80 via-gray-900/30 to-transparent group-hover:from-black/30 group-hover:via-gray-900/10 " />
      <Image
        src={url ?? "/assets/world-map.png"}
        alt={alt ?? "package"}
        width={1024}
        height={1024}
        className="w-full h-full   object-cover overflow-hidden  transform group-hover:scale-105 transition-transform  duration-300"
      />

      <div className="absolute  bottom-0 z-20  w-full     text-white">
        <h2 className="font-semibold text-xl ml-4 mb-2 leading-tight ">
          {title}
        </h2>
        <div className="w-full ">
          <div className="bg-background/0 backdrop-blur-sm  overflow-hidden">
            <BookNowBtn
              className="h-12  px-4 w-full flex items-center justify-between text-black  font-medium rounded-none  py-2 shadow-md transition-colors"
              adultPrice={adultPrice}
              duration={duration}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
