"use client";

import Bounded from "@/components/elements/Bounded";
import InfoCard from "@/components/footer/InfoCard";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import CopyRight from "./CopyRight";

const Footer = () => {
  return (
    <footer className="text-white bg-black ">
      <Bounded className="flex flex-col justify-evenly">
        <FloatingWhatsApp
          phoneNumber="7034191993"
          accountName="Minar Cruise Cochin"
          avatar="/assets/favicon.svg"
        />
        <InfoCard />
        <CopyRight />
      </Bounded>
    </footer>
  );
};

export default Footer;
