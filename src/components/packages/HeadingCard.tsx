import { Baby, Clock, Hourglass, HourglassIcon, UserRound } from "lucide-react";
import moment from "moment";
import Bounded from "../elements/Bounded";
import { db } from "@/db";
import { Package, PackageImage, Image, Amenities } from "@prisma/client";
import { cn, isProd } from "@/lib/utils";
import {format } from 'date-fns'
import { ReactNode } from "react";

type THeadingCard = Package & {
  className?: string;
};
const HeadingCard = async ({
  title,
  adultPrice,
  childPrice,
  duration
}: THeadingCard) => {
  
  return (
    <div className="bg-orange-100 ">
      <Bounded className="flex max-sm:flex-col max-md:gap-3 justify-between py-10">
        <article className="space-y-3 max-md:text-center">
          <h2 className="font-bold text-4xl">{title}</h2>
          <div className="inline-flex space-x-3">
            <Hourglass color="red" strokeWidth={2} size={30} />
            {/* TODO: fix seeding time data in data.ts file
                fix how to decode time formate here
            */}
            <p className="my-auto">{"time"}</p>
          </div>
        </article>
        <article className="flex max-md:items-center max-md:flex-col my-auto  space-x-11">
          <AsideInfo label="Duration" icon={<Clock size={35} color="red" />}>
            {`${duration/60} hours`}
          </AsideInfo>
          <AsideInfo
            label={"adult"}
            icon={<UserRound size={35} color="red" />}
          >
            {`₹${adultPrice/100}`}
          </AsideInfo>
          <AsideInfo
            label={"child"}
            icon={<Baby size={35} color="red" />}
          >
            {`₹${childPrice/100}`}
          </AsideInfo>
        </article>
      </Bounded>
    </div>
  );
};

function AsideInfo({
    className,
    children,
    label,
    icon,
  }: {
    className?: string;
    children?: React.ReactNode;
    label?: string;
    icon?: ReactNode;
  }) {
    return (
      <div className={cn("inline-flex space-x-3", className)}>
        <div className="my-auto">{icon}</div>
        <div className="">
          <h6 className="font-semibold text-gray-500">{label}</h6>
          <p>{children}</p>
        </div>
      </div>
    );
  }
  
export default HeadingCard;
