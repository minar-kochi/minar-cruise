import { BookingData } from "@/constants/home/landingData";
import Image from "next/image";
import React, { ReactElement } from "react";

export default function BookingDescriptionText() {
  const { mainHeading, subHeading, features } = BookingData;
  return (
    <article className="bg-white w-[90%] h-[90%] rounded-lg pt-5 mt-4">
      <h3 className="text-[#0D3A62] text-3xl font-medium mt-2 md:mt-4 mb-3 ml-7">
        {mainHeading} <span className="text-red-700 font-semibold">Minar</span>
      </h3>
      <h4 className="text-[#0D3A62] text-xs mx-7">{subHeading}</h4>
      {features.map((item, i) => (
        <BookingLabel
          key={i + item.heading}
          desc={item.description}
          heading={item.heading}
          Logo={item.icon}
        />
      ))}
    </article>
  );
}

function BookingLabel({
  Logo,
  heading,
  desc,
}: {
  Logo: string;
  heading: string;
  desc: string;
}) {
  return (
    <div className="lg:flex lg:gap-10 xl:gap-12">
      <div className="flex items-center gap-4 mx-4 sm:mx-8 my-4">
        <Image alt="cruise" src={Logo} width={400} height={400 } className="w-12 h-12" />
        <div className="">
          <h2 className="text-md md:text-lg font-semibold ">{heading}</h2>
          <p className="text-xs md:text-md ">{desc}</p>
        </div>
      </div>
    </div>
  );
}
