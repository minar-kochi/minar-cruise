import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, UserRound, Users, UsersRound } from "lucide-react";
import React from "react";
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

interface TBookButton {
  containerClass?: string;
  className?: string;
  adultPrice: number;
  duration: number;
}

export default function BookNowBtn({
  containerClass,
  className,
  adultPrice,
  duration,
}: TBookButton) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between rounded-lg bg-black/40 p-3">
        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-black">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">
              {formatPrice(adultPrice)}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-black">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {formatDuration(duration)}
            </span>
          </div>
        </div>
        <Button size="sm" className="">
          Book Now
        </Button>
      </div>
    </div>
  );
}
