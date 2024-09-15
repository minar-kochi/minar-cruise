import { Mail, MapPin, Phone } from "lucide-react";
import { footer } from "@/constants/home/landingData";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

const FooterContactCard = ({
  className,
  logo,
}: {
  className?: string;
  logo?: boolean;
}) => {
  const { contact, email, address, image } = footer;
  return (
    <section className={cn("flex flex-col gap-8 items-start ", className)}>
      <Image
        src={image}
        alt="Minar Logo"
        width={150}
        height={150}
        className={cn("max-sm:mx-auto", {
          hidden: !logo,
        })}
      />
      <div className=" flex  w-full md:max-w- ">
        <Phone color="white" className="" />
        {contact.map((item, i) => (
          <Link href={`tel:${item}`} key={`${item}-${i}-contact`}>
            <p className="pl-2 flex text-white font-medium ">{item}</p>
          </Link>
        ))}
      </div>
      <div className=" flex gap-4 w-full justify-start  md:max-w-fit">
        <Mail color="white" />
        <Link href="info@cochincruiseline.com">
          <p className=" text-center  w-full text-white font-medium">{email}</p>
        </Link>
      </div>
      <div className="flex gap-2 ">
        <div className="">
          <MapPin className="" color="white" />
        </div>
        <Link href="https://maps.app.goo.gl/aj9HE3CBcnD8sTQc6">
          <p className=" text-justify text-white font-medium max-w-xs">
            {address}
          </p>
        </Link>
      </div>
    </section>
  );
};

export default FooterContactCard;
