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
              Minar Cruise is a private catamaran sea cruise in Kerala, India.
              Minar Tourist Boat Cochin & Traders is registered with the Indian
              Register of Shipping. Our fleet has been providing hospitality and
              professional services for 20 years. The luxurious air-conditioned
              hall can be used for a variety of events, including official
              meetings, parties, family functions, weddings, and engagements.
              Our intimate fleet can seat up to 146 passengers, and has
              all-suite and all-balcony ships with superior service ratios. We
              have permission to cruise up to 12 nautical miles and offer
              scheduled trips ranging from 2 to 4 hours, which can be customized
              according to your needs. Join us on your next journey to
              experience the scenic beauty of Kochi and the Arabian Sea.
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
