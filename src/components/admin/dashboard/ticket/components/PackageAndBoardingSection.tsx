import type React from "react";
import Image from "next/image";

interface PackageAndBoardingSectionProps {
  bookingPackage: string;
  boardingTime: string;
  boatLogoUrl: string;
}

const PackageAndBoardingSection: React.FC<PackageAndBoardingSectionProps> = ({
  bookingPackage,
  boardingTime,
  boatLogoUrl,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-around mb-8 md:mb-10 py-6 space-y-6 sm:space-y-0 bg-gradient-to-r from-blue-50 to-gray-50 rounded-lg">
      <div className="text-center px-4">
        <h3 className="font-bold text-base md:text-lg mb-3 text-gray-800 uppercase tracking-wide">
          Booking Package
        </h3>
        <p className="text-sm md:text-base font-medium text-gray-700 bg-white px-4 py-2 rounded-lg shadow-sm">
          {bookingPackage}
        </p>
      </div>
      <div className="text-center px-4">
        <div className="bg-white rounded-full p-4 shadow-md">
          <Image
            src={boatLogoUrl || "/placeholder.svg"}
            alt="boat logo"
            width={720}
            height={480}
            className="w-20 h-12 sm:w-28 sm:h-16 mx-auto"
          />
        </div>
      </div>
      <div className="text-center px-4">
        <h3 className="font-bold text-base md:text-lg mb-3 text-gray-800 uppercase tracking-wide">
          Boarding Time
        </h3>
        <p className="text-lg md:text-xl font-bold text-gray-800 bg-white px-4 py-2 rounded-lg shadow-sm">
          {boardingTime}
        </p>
      </div>
    </div>
  );
};

export default PackageAndBoardingSection;