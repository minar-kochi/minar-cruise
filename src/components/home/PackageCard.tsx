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
      className="relative w-[100%] max-w-[380px] h-[16rem]  rounded-xl overflow-hidden shadow-sm  "
      href={slug}
    >
      <div className="absolute h-full w-full  bg-gradient-to-t from-black/80 via-gray-500/20 to-slate-50/5" />
      <Image
        src={url ?? "/assets/world-map.png"}
        alt={alt ?? "package"}
        width={1024}
        height={1024}
        className="w-full h-full object-cover "
      />

      <div className="absolute w-full bottom-3  px-3">
        <div className="w-full flex flex-col ">
          <h2 className="font-medium text-white text-lg mb-1 hover:text-red-100">
            {title}
          </h2>

          <BookNowBtn
            className="h-12 justify-between  "
            adultPrice={adultPrice / 100}
            duration={duration}
          />
        </div>
      </div>
    </Link>
  );
}
