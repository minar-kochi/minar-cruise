import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const packageDetails = [
  {
    packageName: "Morning Ride",
    imgUrl: "https://cochincruiseline.com/wp-content/uploads/2022/12/minar.jpg",
    price: "12000",
  },
  {
    packageName: "Lunch Ride",
    imgUrl: "https://cochincruiseline.com/wp-content/uploads/2022/12/minar.jpg",
    price: "9000",
  },
  {
    packageName: "Night Ride",
    imgUrl: "https://cochincruiseline.com/wp-content/uploads/2022/12/minar.jpg",
    price: "22000",
  },
];

export default function PackagesInBlog() {
  return (
    <div className="ml-5">
      <h1 className="text-2xl font-bold ">Minar Cruise Packages</h1>
      <div className="mt-5">
        {packageDetails.map((item, i) => (
          <>
            <div key={i} className="flex gap-5">
              <Image
                src={item.imgUrl}
                width={400}
                height={400}
                alt={item.packageName}
                className="w-[88px] h-[88px] object-cover rounded-xl"
              />
              <div className="flex flex-col gap-1 justify-center">
                <h2 className="font-semibold">{item.packageName}</h2>
                <p className="text-muted-foreground">
                  From{" "}
                  <span className="font-light text-red-600">{item.price}</span>{" "}
                </p>
              </div>
            </div>
            <div
              className={cn(
                "h-[0.1px] rounded-r-full rounded-l-full my-4 w-full bg-gray-300",
                {
                  hidden: i === packageDetails.length - 1,
                },
              )}
            />
          </>
        ))}
      </div>
    </div>
  );
}
