import Image from "next/image";
import { packageCard } from "@/constants/gallery/gallery";
import {
  ArrowRight,
  ArrowRightSquare,
  CameraIcon,
  Clock,
  Heart,
  Star,
  UserRound,
} from "lucide-react";
import { Button } from "../ui/button";

const PackageCard = () => {
  const [image] = packageCard;
  return (
    <div className="mt-5 max-w-[355px] w-full  group ">
      <div className="relative rounded-t-xl overflow-hidden">
        <div className="absolute right-4 top-4">
          <Heart
            className="bg-black/25 rounded-md p-1 stroke-white active:fill-red-600 active:stroke-none"
            size={34}
          />
        </div>
        <Image
          src={image}
          width={500}
          height={600}
          className="object-cover aspect-[4/3]"
          alt="{give-package-title-here }"
        />
      </div>
      <div className="relative -mt-12  py-4 px-4 rounded-t-2xl rounded-b-lg bg-white min-h-[150px] shadow-md hover:shadow-xl ">
        <div className="flex items-center  justify-between overflow-hidden h-[30px]  relative">
          <div className="flex relative	py-2 ">
            <div className="overflow-hidden w-full flex group-hover:w-0  flex-shrink-0 transition-all duration-500 ease-linear">
              <Star size={20} className="fill-[#f7931e] stroke-0" />
              <Star size={20} className="fill-[#f7931e] stroke-0" />
              <Star size={20} className="fill-[#f7931e] stroke-0" />
              <Star size={20} className="fill-[#f7931e] stroke-0" />
              <Star size={20} className="fill-[#f7931e] stroke-0" />
            </div>
            <div className="flex items-center justify-center">
              <Star className="fill-[#f7931e] stroke-0 w-0 group-hover:w-6  transition-all ease-linear" />
              4.6
            </div>
          </div>
          <div>
            <CameraIcon />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex">
            <h6 className="text-xl text-wrap flex flex-wrap font-semibold">
              Special Sunset 4 Hour cruise
            </h6>
          </div>
          <p className="text-muted-foreground font-medium">For Adult <span className="text-red-400">₹900</span></p>
          <div className="flex items-center justify-between  bg-orange-50 p-2 rounded-lg">
            <div className="flex gap-2 items-center justify-center">
              <Clock size={18} className="stroke-primary" />
              <p className="text-sm text-gray-500 font-medium">2 hours</p>
            </div>
            <div className="flex gap-2 items-center justify-center">
              <UserRound size={17} className="stroke-primary" />
              <p className="text-sm text-gray-500 font-medium">150</p>
            </div>
            <Button className="tracking-wider">
              Book Now
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
