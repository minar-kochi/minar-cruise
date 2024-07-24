import { BookingData } from "@/constants/home/landingData";
import React, { ReactElement } from "react";

export const BookingDescriptionItems = () => {
  const { features } = BookingData;
  return (
    <>
      {features.map((item, i) => (
        <BookingLabel
          key={i+item.heading}
          desc={item.description}
          heading={item.heading}
          Logo={<item.icon size={74} className={item.iconClass} stroke="red"/>}
        />
      ))}
    </>
  );
};

function BookingLabel({
  Logo,
  heading,
  desc,
}: {
  Logo: ReactElement;
  heading: string;
  desc: string;
}) {
  return (
    <>
      <div className="flex items-center gap-5">
        {Logo}
        <div className="md:space-y-2">
          <h2 className="text-xl md:text-2xl font-bold text-">{heading}</h2>
          <p className="text-sm md:text-lg">{desc}</p>
        </div>
      </div>
    </>
  );
}
