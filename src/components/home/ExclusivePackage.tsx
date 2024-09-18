import { Star } from "lucide-react";
import React from "react";
import BookNowBtn from "./BookNowBtn";
import Image from "next/image";
import Bounded from "@/components/elements/Bounded";
import { Exclusive } from "@/constants/home/landingData";
import { Button } from "../ui/button";
import Link from "next/link";

export default function ExclusivePackage() {
  const { mainHeading, subHeading, desc, video1 } = Exclusive;
  return (
    <Bounded className="my-10">
      <h2 className="text-4xl text-[#0D3A62] font-semibold flex items-center">
        <span className="mr-1">
          <Image
            alt="facilities"
            src="/assets/titleicons/star.svg"
            width={500}
            height={500}
            className="size-9 text-[#0D3A62]"
          />
        </span>
        {mainHeading}
      </h2>

      <p className="text-sm text-muted-foreground tracking-wider my-3  ">
        {subHeading}
      </p>

      <div className="relative rounded-xl overflow-hidden">
        <div className="absolute h-full w-full  bg-gradient-to-t from-black/80 via-gray-500/20 to-slate-50/5" />
        {/* <div className="absolute w-full h-full  bg-[radial-gradient(circle,_rgba(0,0,0,0)_20%,rgba(0,0,0,1)_100%)] "></div> */}

        <video
          className="  object-cover  w-full mx-auto h-[35rem] rounded-lg"
          playsInline
          preload="none"
          muted
          autoPlay
          loop
          // width={1080}
          // height={1920}
        >
          <source src={video1.url} type="video/mp4" />
        </video>
        {/* <div className="w-[90%] ">
          <div className="w-96  absolute bottom-[15%] right-[5%]">
            <p className="text-xs text-gray-50 text-end">
              If you are planning an anniversary, your daughter’s wedding,
              Corporate event or a special event with a party of 50 to 140
              guests: your choice should be an exclusively chartered cruise
              ship.
            </p>
            <p className="text-xs text-gray-50 text-end">
              You will be savoring the most memorable moments together in an
              exceptional ambience along with the entertainment team to serve
              you with fun-filled entertainment performances.
            </p>
            <p className="text-sm text-gray-50 text-end">
              EXCLUSIVE CRUISE FOR MULTIPLE FUNCTIONS
            </p>
            <p className="text-xs text-gray-50 text-end">
              Get together party Birthday Party Wedding functions Corporate &
              Business meetings Pre wedding functions
            </p>
          </div>
        </div> */}
        <div className="absolute bottom-5 left-0 right-0 m-auto w-[90%] ">
          <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-2">
            <div className=" max-sm:items-center max-sm:flex-col max-sm:flex">
              <h3 className="text-2xl lg:text-3xl font-semibold text-white">
                Exclusive Package
              </h3>
              <div className="">
               
              </div>
            </div>
            <div>
              {/* <BookNowBtn /> */}
              <Link href="/package/premium-cruise">
                <Button size={"lg"} className="text-lg shadow-2xl">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Bounded>
  );
}
