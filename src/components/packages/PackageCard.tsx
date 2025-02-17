import Image from "next/image";

import { Baby, Check, Clock, MapPin, UserRound } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { TAmenitiesGetPackageCardDetails } from "@/db/data/dto/package";
import Link from "next/link";
import { PACKAGE_CATEGORY } from "@prisma/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "../ui/badge";

interface IPackageCard {
  url: string;
  alt: string;
  title: string;
  adultPrice: number;
  childPrice: number;
  PackageId: string;
  className?: string;
  amenities: TAmenitiesGetPackageCardDetails;
  packageCategory: PACKAGE_CATEGORY;
  slug: string;
  fromTime: string;
  toTime: string;
}
const PackageCard = ({
  adultPrice,
  childPrice,
  slug,
  alt,
  title,
  url,
  className,
  amenities,
  PackageId,
  packageCategory,
  fromTime,
}: IPackageCard) => {

  return (
    <Card
      className={cn(
        "w-full max-w-[500px]    overflow-hidden transition-all border-black duration-300 hover:shadow-lg",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={url ?? "/assets/world-map.png"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          alt={alt ?? "Package Image"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />

        <Badge className="absolute top-4 left-4 bg-white/90 text-black hover:bg-white/80">
          {packageCategory}
        </Badge>
      </div>

      <CardContent className="p-6">
        <div className="mb-4 space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">{title}</h3>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {fromTime && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{fromTime}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {amenities.description.slice(0, 4).map((item, i) => (
            <div key={item + i} className="flex items-start gap-2 text-sm">
              <Check size={16} className="mt-1 text-green-500 shrink-0" />
              <span className="line-clamp-1">{item}</span>
            </div>
          ))}
          <Link href={`/package/${slug}`}>
            <p className="text-sm font-medium text-muted-foreground ml-5">more info</p>
          </Link>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <UserRound className="text-primary" size={20} />
            <div>
              <p className="text-sm text-muted-foreground">Adult</p>
              <p className="font-semibold">
                ₹{(adultPrice / 100).toLocaleString()}/-
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Baby className="text-primary" size={20} />
            <div>
              <p className="text-sm text-muted-foreground">Child</p>
              <p className="font-semibold">
                ₹{(childPrice / 100).toLocaleString()}/-
              </p>
            </div>
          </div>
        </div>

        <Link href={`/package/${slug}`}>
          <Button size="lg" className="font-semibold">
            Book Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PackageCard;
