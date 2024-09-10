import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";
import BookNowBtn from "./BookNowBtn";
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

export default function SpecialPackageCard({
  alt,
  url,
  title,
  className,
  slug,
  adultPrice,
  duration,
}: IPackageCard) {
  return (
    <Link
      className="w-full xl:w-[24rem] h-[30rem] shadow-sm  rounded-xl overflow-hidden relative"
      href={slug}
    >
      <div className="absolute h-full w-full  bg-gradient-to-t from-black/80 via-gray-500/20 to-slate-50/5" />

      <Image
        src={url}
        alt={alt}
        width={3024}
        height={4032}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-5 left-4">
        <h2 className="font-medium text-white text-lg hover:text-red-100">{title}</h2>

        <BookNowBtn
          className="py-2 w-full"
          adultPrice={adultPrice / 100}
          duration={duration}
        />
      </div>
    </Link>
  );
}
