import React from "react";
import Bounded from "../elements/Bounded";
import Image from "next/image";
import { Button, buttonVariants } from "../ui/button";
import BoatAnimation from "./BoatAnimation";
import BioTextAnimation from "./BioTextAnimation";
import Link from "next/link";

const MinarSec = () => {
  return (
    <Bounded className="">
      <div className="p-5 max-md:p-0 my-10">
        <div className="flex justify-around  md:gap-16  max-lg:flex-col  ">
          <div className="flex flex-col gap-6 justify-around  my-5 ">
            <div className="overflow-hidden">
              <BioTextAnimation />
            </div>
            <p className="font-sans tracking-wide leading-7  text-left">
              Minar Cruise is India&apos;s largest private luxurious yacht
              registered under IRS (Indian Register of Shipping). It&apos;s a
              sea-going vessel, perfect for unforgettable experiences on the
              Arabian Sea. Our beautiful cruise ship features three amazing
              floors. The first floor includes a completely air-conditioned
              banquet hall suitable for grand events. The second floor is an
              open area where you can enjoy a breathtaking 360-degree view of
              the Arabian Sea, along with an exclusive, cosy air-conditioned VIP
              lounge. The third floor is an open sundeck, providing even more
              space for fun and relaxation. Our sea-going vessel can accommodate
              up to 150 guests, making it perfect for memorable corporate
              meetings, family gatherings, birthday parties, and even beautiful
              wedding ceremonies. Live singers, spectacular magic performances,
              mentalism acts, and a vibrant DJ are all available on board. Sail
              on the Arabian Sea with our elegant sea-going vessel, Minar Cruise
              Cochin, and have experiences that will last a lifetime.
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
            src="/assets/IMG_8139 (1).JPEG"
            alt="cruise"
            width={4000}
            height={2250}
            placeholder="blur"
            blurDataURL="/assets/Screenshot 2024-09-10 210118.png"
            className="min-w-[500px]  max-sm:min-w-[300px] mt-4 object-cover rounded-xl "
          />
        </div>
      </div>
    </Bounded>
  );
};

export default MinarSec;
