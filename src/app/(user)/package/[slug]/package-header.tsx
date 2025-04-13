import React from "react";
import { Clock, User, Baby, ShipIcon } from "lucide-react";
import { TGetPackageById } from "@/db/data/dto/package";
import { $Enums } from "@prisma/client";
import { isPackageStatusExclusive } from "@/lib/validators/Package";

const PackageHeader = ({ data }: { data: TGetPackageById }) => {
  const formatPrice = (priceInPaise: number) => `₹${priceInPaise / 100}/-`;

  const categoryStyles: Record<$Enums.PACKAGE_CATEGORY, string> = {
    BREAKFAST: "from-amber-400 to-yellow-300",
    LUNCH: "from-orange-400 to-red-300",
    SUNSET: "from-rose-500 to-pink-400",
    DINNER: "from-indigo-500 to-purple-400",
    EXCLUSIVE: "from-purple-500 to-violet-400",
    CUSTOM: "",
  };

  return (
    <div className="relative w-full my-2 mx-auto rounded-xl shadow-lg overflow-hidden bg-white/80  p-6">
      {/* Background Accent */}
      <div
        className={`absolute inset-0 bg-gradient-to-br  opacity-20 rounded-xl`}
      />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Title & Icon */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/40 shadow-md">
            <span className="text-3xl">{<ShipIcon />}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 drop-shadow-md">
              {data.title}
            </h1>
            <p className="text-sm font-medium text-gray-700 capitalize">
              {data.packageCategory.toLowerCase()} package
            </p>
          </div>
        </div>

        {/* Price & Time Section */}
        {!isPackageStatusExclusive(data.packageCategory) && (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Pricing Cards */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-lg shadow-md">
                <User className="w-5 h-5 text-gray-700" />
                <div className="text-gray-800">
                  <span className="text-xs block">Adult</span>
                  <span className="font-bold">
                    {formatPrice(data.adultPrice)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-lg shadow-md">
                <Baby className="w-5 h-5 text-gray-700" />
                <div className="text-gray-800">
                  <span className="text-xs block">Child</span>
                  <span className="font-bold">
                    {formatPrice(data.childPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Time Display */}
            <div className="flex items-center gap-3 px-4 py-2 bg-white/70 rounded-lg shadow-md">
              <Clock className="w-5 h-5 text-gray-700" />
              <div className="text-gray-800">
                <span className="text-xs block">Time</span>
                <span className="font-bold">
                  {data.fromTime} - {data.toTime}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageHeader;
