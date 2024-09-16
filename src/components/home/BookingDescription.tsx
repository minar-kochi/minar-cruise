import Image from "next/image";
import React from "react";
import BookingDescriptionText from "./BookingDescriptionText";
import Bounded from "@/components/elements/Bounded";
import { BookingData } from "@/constants/home/landingData";
import BoatAnimation from "./BoatAnimation";

export default function BookingDescription() {
  const { bgImage } = BookingData;

  return (
    <Bounded className="">
      <div className="min-h-[90vh] flex flex-col-reverse md:flex-row justify-center rounded-3xl w-full max-md:gap-5 bg-black "
         style={{
          background: 'url("/assets/sea2.gif")',
          backgroundSize: "cover",
        }}
      >
        <div className="md:w-[50%] flex flex-col items-center justify-center">
 
          <div className="relative w-[90%]  ">
            {/* <div className="absolute w-full h-full  bg-[radial-gradient(circle,_rgba(0,0,0,0)_20%,rgba(0,0,0,1)_100%)] pointer-events-noneborder-2  "></div> */}
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
