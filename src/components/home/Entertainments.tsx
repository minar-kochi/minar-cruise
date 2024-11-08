import Bounded from "@/components/elements/Bounded";
import { entertainment } from "@/constants/home/landingData";
import Image from "next/image";
import React from "react";

export default function Entertainments() {
  const { image, activities } = entertainment;
  return (
    <Bounded className="min-h-[40vh] my-20">
      <h2 className="text-center font-light my-5 text-3xl">
        Planning to Enjoy{" "}
        <span className="font-medium text-red-700">Party</span>?
      </h2>
      <div className=" flex justify-center rounded-xl  relative bg-black mx-auto ">
        <div>
          <Image
            src={image.logo}
            alt="logo"
            width={200}
            height={200}
            className="absolute top-6 left-6 bg-white rounded-2xl py-2 px-3 md:px-4 w-20 md:w-32"
          />
        </div>
        <Image
          alt="cruise"
          src={image.url}
          width={1920}
          height={1080}
          className="min-w-full min-h-[35rem] object-cover rounded-lg"
        />
        <h1 className="lg:text-5xl md:text-2xl font-bold absolute bg-white top-24 lg:top-16 lg:right-0 px-4 lg:px-10 py-4 rounded-sm">
          Entertainments
        </h1>
        <div className="absolute top-1/3 lg:top-1/3 lg:right-32">
          {activities.map((item, i) => {
            return (
              <div className="mb-6" key={`${i}${item.description}`}>
                <li className="flex font-medium  text-white">
                  <item.icon width={64} />
                  <p className="text-xl tracking-wide">{item.description}</p>
                </li>
              </div>
            );
          })}
        </div>
      </div>
    </Bounded>
  );
}
