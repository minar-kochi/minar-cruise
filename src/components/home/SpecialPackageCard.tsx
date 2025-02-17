import { Star, Clock, Users } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BookNowBtn from "./BookNowBtn";
import Image from "next/image";

interface PackageCardProps {
  url: string;
  alt: string;
  title: string;
  className?: string;
  slug: string;
  adultPrice: number;
  duration: number;
  rating?: number;
  maxGroupSize?: number;
  isSpecialOffer?: boolean;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price / 100);
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export default function SpecialPackageCard({
  alt,
  url,
  title,
  className,
  slug,
  adultPrice,
  duration,
  rating = 4.5,
  maxGroupSize = 10,
  isSpecialOffer = false,
}: PackageCardProps) {
  return (
    <Card
      className={cn(
        "group relative h-[30rem] w-full overflow-hidden transition-all hover:shadow-lg xl:w-[24rem]",
        className,
      )}
    >
      <a
        href={slug}
        className="block h-full"
        aria-label={`View details for ${title}`}
      >
        {isSpecialOffer && (
          <Badge className="absolute right-4 top-4 z-30 animate-pulse bg-red-500">
            Special Offer
          </Badge>
        )}

        <div className="absolute h-full w-full bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:opacity-80 z-10" />

        <Image
          width={1920}
          height={1080}
          src={url ?? "/assets/world-map.png"}
          alt={alt ?? "Tour package"}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        <CardContent className="absolute bottom-0 left-0 right-0 z-20 p-4 text-white">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold  line-clamp-2">{title}</h2>
            {/* <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{rating}</span>
            </div> */}
          </div>

          <BookNowBtn adultPrice={adultPrice} duration={duration} />
        </CardContent>
      </a>
    </Card>
  );
}
