import React from "react";
import Bounded from "../elements/Bounded";
import Image from "next/image";
import { Button, buttonVariants } from "../ui/button";
import BoatAnimation from "./BoatAnimation";
import BioTextAnimation from "./BioTextAnimation";
import Link from "next/link";
import { fallBackImgBlur, landingData } from "@/constants/home/landingData";
import { CONSTANTS } from "@/constants/data/assets";

const MinarSec = () => {
  const { description, image } = landingData;
  return (
    <Bounded className="">
      <div className="p-5 max-md:p-0 my-10">
        <div className="flex justify-around  md:gap-16  max-lg:flex-col  ">
          <div className="flex flex-col gap-6 justify-around  my-5 ">
            <div className="overflow-hidden">
              <BioTextAnimation />
            </div>
            <p className="font-sans tracking-wide leading-7  text-left">
              {description}
            </p>
            <Link
              href="/about"
              className={buttonVariants({
                className: "rounded-lg w-[50%]",
              })}
            >
              Read More
            </Link>
          </div>
          <Image
            src={image.url}
            alt={image.alt}
            width={4000}
            height={2250}
            placeholder="blur"
            blurDataURL={fallBackImgBlur.url}
            className="min-w-[500px]  max-sm:min-w-[300px] mt-4 object-cover rounded-xl "
          />
        </div>
      </div>
    </Bounded>
  );
};

export default MinarSec;
