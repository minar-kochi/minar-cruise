import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Baby,
  CameraIcon,
  Check,
  Clock,
  Heart,
  Star,
  TicketIcon,
  UserRound,
} from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { TAmenitiesGetPackageCardDetails } from "@/db/data/dto/package";
import Link from "next/link";
import PackageForm from "../package/new-page/PackageForm";
import { PACKAGE_CATEGORY } from "@prisma/client";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

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
}
const PackageCard = async ({
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
}: IPackageCard) => {
  return (
    <div className={cn("max-w-[400px] w-full ", className)}>
      <div className="relative overflow-hidden rounded-sm ">
        <div className="relative border-4 border-white ">
          <Image
            src={url ?? "/assets/world-map.png"}
            width={500}
            height={600}
            className="object-fill aspect-[6/4] rounded-sm"
            alt={alt ?? "/assets/world-map.png"}
          />
          <div className="absolute  top-0 border w-full h-full bg-black/50 z-0 rounded-sm"></div>
          <div className="absolute top-2 sm:top-5 left-2 sm:left-5 text-white space-y-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <ul className="space-y-2">
              {amenities.description.map((item, i) => {
                return (
                  <li
                    key={item + i}
                    className="text-xs  font-bold flex gap-2 items-center tracking-wider"
                  >
                    <Check size={12} />
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="absolute flex justify-between items-center px-5 bottom-0 h-[60px] bg-white w-full rounded-xl z-10">
          <div className=" w-full flex gap-4">
            <div className=" flex gap-2">
              <UserRound stroke="red" />
              <p className="font-bold">{adultPrice / 100}/-</p>
            </div>
            <div className=" flex gap-2">
              <Baby stroke="red" />
              <p className="font-bold">{childPrice / 100}/-</p>
            </div>
          </div>

          <Link href={`/package/${slug}`}>
            <Button className="rounded-full">Book Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
