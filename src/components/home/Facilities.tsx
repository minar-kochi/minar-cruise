import Bounded from "@/components/elements/Bounded";
import { facilities } from "@/constants/home/landingData";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import React, { ReactElement } from "react";

export default function Facilities() {
  const { description } = facilities;
  return (
    <Bounded className="my-20">
      <div className="flex items-center justify-center md:justify-start gap-2 mb-6 my-12 ">
        <Image
          alt="facilities"
          src="/assets/titleicons/verify.svg"
          width={500}
          height={500}
          className="size-9 text-[#0D3A62]"
        />
        <h2 className="text-4xl text-[#0D3A62] font-semibold  ">Facilities</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        {description.map((item, i) => (
          <FacilitiesLabel
            key={i + item.heading}
            desc={item.description}
            heading={item.heading}
            Logo={item.icon}
          />
        ))}
      </div>
    </Bounded>
  );
}

function FacilitiesLabel({
  Logo,
  heading,
  desc,
}: {
  Logo: string;
  heading: string;
  desc: string;
}) {
  return (
    <>
      <div className="flex flex-col  items-center  w-[170px]  flex-shrink-0">
        <div className="bg-red-600 p-4 rounded-lg">
          <Image
            src={Logo}
            alt="cruise"
            width={480}
            height={480}
            className="max-w-[60px]"
          />
        </div>
        <h2 className="text-sm max-md:text-md font-semibold my-1 ">{heading}</h2>
        <p className=" hidden md:block text-xs max-md:text-sm text-center px-4  text-muted-foreground tracking-wide ">
          {desc}
        </p>
      </div>
    </>
  );
}
