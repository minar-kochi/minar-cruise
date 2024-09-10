import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, UserRound, Users, UsersRound } from "lucide-react";
import React from "react";

interface TBookButton {
  className?: string;
  adultPrice: number;
  duration: number;
}

export default function BookNowBtn({
  className,
  adultPrice,
  duration,
}: TBookButton) {
  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex justify-evenly items-center py-2  px-3 rounded-xl shadow-2xl gap-3 bg-white w-full border-3",
          className,
        )}
      >
        <div className="flex gap-4">
          <div className="flex gap-1 items-center justify-center hover:text-red-900">
            <Users className="w-[16px] h-[16px] md:h-5 md:w-5" />
            <p className="text-sm md:text-base font-medium">{adultPrice} -/ </p>
          </div>
          <div className="flex gap-1 items-center justify-center hover:text-red-900">
            <Clock className="w-[16px] h-[16px] md:h-5 md:w-5" />
            <p className="text-sm md:text-base font-medium">{duration} min</p>
          </div>
        </div>
        <div>
          <Button size={"xs"} className="">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
