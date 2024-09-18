import Image from "next/image";
import React from "react";
import BookingDescriptionText from "./BookingDescriptionText";
import Bounded from "@/components/elements/Bounded";
import { BookingData } from "@/constants/home/landingData";
import BoatAnimation from "./BoatAnimation";

export default function BookingDescription() {
  const { bgImage } = BookingData;

  return (
    <Bounded className="overflow-hidden">
      <div className="min-h-[90vh] z-10  relative flex flex-col-reverse md:flex-row justify-center rounded-3xl w-full max-md:gap-5 bg-black ">
        <video
          playsInline
          preload="none"
          muted
          autoPlay
          loop
          width={1080}
          height={1920}
          className="absolute -z-10 top-0 object-cover overflow-hidden rounded-3xl left-0 w-full h-full"
        >
          <source src="/assets/sea2-converted.mp4" />
        </video>
        <div className="md:w-[50%] flex flex-col items-center justify-center">
          <div className="relative w-[90%]  ">
            <BoatAnimation />
          </div>
        </div>
        <div className="md:w-[50%] flex justify-center items-center ">
          <BookingDescriptionText />
        </div>
      </div>
    </Bounded>
  );
}
