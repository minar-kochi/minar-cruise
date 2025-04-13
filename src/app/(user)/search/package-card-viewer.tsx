import { Button } from "@/components/ui/button";
import { TGetPackageSearchItems } from "@/db/data/dto/package";
import { formatPrice, RemoveTimeStampFromDate } from "@/lib/utils";
import { Baby, CheckCircle2, User } from "lucide-react";
import Image from "next/image";
import React from "react";
import QuickPackageForm from "./package-form";
import { TSchedulesData } from "@/Types/Schedule/ScheduleSelect";
import Link from "next/link";
type TPackageSelectCard = {
  item: TGetPackageSearchItems[number];
  schedules: TSchedulesData;
};

export default function PackageCardViewer({
  item,
  schedules,
}: TPackageSelectCard) {
  return (
    <div className="my-1 relative">
      <div className="flex relative flex-col md:flex-row gap-2 md:gap-4 md:px-4 md:py-4  py-2 px-2 rounded-[25px] bg-white hover:bg-muted-foreground/5 border-muted-foreground/40   shadow-md">
        <Link
          href={`/package/${item.slug}?selectedDate=${encodeURIComponent(RemoveTimeStampFromDate(new Date(schedules.day)))}`}
          className=""
        >
          <Image
            className="lg:max-w-[326px] md:max-w-[270px]  rounded-2xl aspect-video object-cover"
            src={item.packageImage[0].image.url}
            alt={item.packageImage[0].image.alt}
            width={720}
            height={420}
          />
        </Link>
        <div className="w-full flex flex-col justify-between pb-2">
          <div className="flex items-center justify-between">
            <h1 className="text-lg line-clamp-1 md:text-xl font-medium">
              {item.title}
            </h1>
            <Link
              href={`/package/${item.slug}?selectedDate=${encodeURIComponent(RemoveTimeStampFromDate(new Date(schedules.day)))}`}
              className="hidden md:flex bg-none hover:bg-none md:pr-6 text-sm hover:underline"
            >
              View package
            </Link>
          </div>
          <div className="grid w-full  grid-cols-2 place-content-between place-items-stretch gap-y-4 mt-2    ">
            {item.amenities.description.slice(0, 4).map((item, i) => {
              return (
                <div
                  key={`${item}-${i}-amenities-description`}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0  stroke-red-500" />
                  <p
                    key={`${item}-${i}`}
                    className="line-clamp-1 xxs:text-sm md:text-base text-xs   "
                  >
                    <span>{item}</span>
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-2">
            <div className="flex md:flex-row gap-2 flex-col pr-0 md:pr-6 items-center justify-between">
              <Button className="flex w-full md:w-auto pointer-events-none hover:bg-primary/20 md:bg-primary/20 bg-transparent rounded-md px-3 py-3">
                <p className="text-primary  gap-2 flex items-center font-semibold text-sm  justify-center ">
                  <span className="flex gap-1  pr-2 items-center">
                    {<User size={16} className="stroke-[2.5]" />} ₹
                    {formatPrice(item.adultPrice)}/-
                  </span>
                  <span className="flex gap-1 items-center">
                    {<Baby size={16} className="stroke-[2.5]" />} ₹
                    {formatPrice(item.adultPrice)}/-
                  </span>
                </p>
              </Button>
              <QuickPackageForm item={item} schedules={schedules} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
