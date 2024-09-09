import { cn, isProd, sleep } from "@/lib/utils";
import UserBookingDateSelector from "../packages/UserBookingDateSelector";
import { db } from "@/db";
import { getPackageById, TBookingDateSelector } from "@/db/data/dto/package";
import BookingFormCard from "../packages/BookingFormCard";
import { Suspense } from "react";

interface IHeroBookingDateSelector {
  className?: string;
  formData: TBookingDateSelector;
}
export default async function HeroBookingDateSelector({
  className,
  formData,
}: IHeroBookingDateSelector) {
  return (
    <div className={cn(" flex justify-center", className)}>
        <UserBookingDateSelector
          packageCategory={formData?.packageCategory}
          packageId={formData.id}
          packagePrice={{
            adult: formData.adultPrice,
            child: formData.childPrice,
          }}
          packageTitle={formData.title}
          className="min-h-full shadow-none  max-w-[350px]"
        />
    </div>
  );
}
