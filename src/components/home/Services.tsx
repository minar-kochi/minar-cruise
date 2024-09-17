import Bounded from "@/components/elements/Bounded";
import { services } from "@/constants/home/landingData";
import { Phone } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function Services() {
  const { contact, description, events, heading, subHeading, bgVid } = services;

  return (
    <Bounded className="my-[70px] md:my-28 ">
      <h2 className="text-4xl text-[#0D3A62] font-semibold flex items-center">
        <span className="mr-1">
          <Image
            alt="facilities"
            src="/assets/Party Balloons.png"
            width={500}
            height={500}
            className="size-9 text-[#0D3A62]"
          />
        </span>
        {heading}
      </h2>
      <p className="text-sm text-muted-foreground tracking-widest my-3  ">
        {subHeading}
      </p>

      <div className="flex flex-col lg:flex-row w-full gap-6">
        <div className="max-lg:mb-6 basis-[40%] ">
          <div className=" max-lg:w-[100%] mx-auto relative">
            <video
              className="aspect-[64/89] object-cover rounded-xl w-full h-full max-lg:max-h-[40rem]"
              playsInline
              preload="true"
              muted
              autoPlay
              loop
              width={1078}
              height={1080}
            >
              <source src={bgVid} type="video/mp4" />
            </video>

            <div className="absolute bottom-5 left-4  w-full ">
              <div className="flex gap-2">
                {contact.map((item, i) => (
                  <div
                    className="bg-black px-2 py-1 rounded-3xl"
                    key={`${i}${item}`}
                  >
                    <a
                      href={`tel:${item}`}
                      className="font-medium text-sm px-1 text-teal-50 flex items-center gap-1 underline"
                    >
                      <Phone className="w-4" />
                      {item}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className=" basis-[60%] flex flex-col justify-between">
          {events.map((item, i) => (
            <div
              className={`flex gap-4 max-sm:gap-2 max-sm:flex-col  ${i === 1 ? "flex-row-reverse " : ""} items-center `}
              key={`${item.image}-${i}-events-page`}
            >
              <div className="w-1/2 max-sm:w-full">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={1920}
                  height={1024}
                  className="w-full aspect-[16/9.7] rounded-lg object-cover"
                />
              </div>
              <div className="w-1/2 max-sm:w-full max-sm:mb-8">
                <h2 className="text-3xl font-semibold mb-1">{item.title}</h2>
                <p className="leading-2 text-xs font-medium max-w-[80%] ">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Bounded>
  );
}

{
  /* <article className="grid grid-cols-1 lg:grid-cols-[50%_50%] place-content-end gap-6 ">
        <div className="w-full relative  min-h-[500px]">
          <div className="h-[500px]">
            <Image
              alt="cruise"
              src={bgImg}
              fill
              className="w-full h-full aspect-[3/4]  object-cover rounded-xl"
            />
          </div>
          <div className="absolute top-7 text-white text-sm w-[88%] left-5 ">
            <h2 className="font-medium mb-2 leading-6">{subHeading}</h2>
            {description.map((item) => (
              <>
                <p className="font-medium text-xs leading-4">{item}</p>
              </>
            ))}
          </div>

          <div className="absolute top-1/3 left-3">
            <div className="flex gap-2">
              {contact.map((item, i) => (
                <div
                  className="bg-black px-2 py-1 rounded-3xl"
                  key={`${i}${item}`}
                >
                  <a
                    href={`tel:${item}`}
                    className="font-medium text-sm text-teal-50 flex gap-1 underline"
                  >
                    <Phone className="w-5" />
                    {item}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5 items-center">
          {events.map((item, i) => (
              <div  className={`flex gap-4 max-w-fit ${i === 1 ? "flex-row-reverse" : ""} lg:flex-row`} key={item.image + i}>
                <div className="min-w-80 max-h-48 ">
                  <Image
                    src={item.image}
                    alt=""
                    width={1280}
                    height={720}
                    className="w-full h-full object-cover  rounded-lg"
                  />
                </div>
                <div className="max-w-[270px]   ">
                  <h1 className="text-2xl font-semibold mb-1">{item.title}</h1>
                  <p className="leading-2 text-xs font-medium">{item.description}</p>
                </div>
              </div>
          ))}
        </div>
      </article> */
}
