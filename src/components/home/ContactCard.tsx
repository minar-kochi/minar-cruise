import { Mail, MapPin, Phone } from "lucide-react";
import { footer } from "@/constants/home/landingData";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ContactCard = ({
  className,
  logo,
}: {
  className?: string;
  logo?: boolean;
}) => {
  const { contact, email, address, image } = footer;
  return (
    <>
      <section className={cn("flex flex-col gap-8 items-start ", className)}>
        <Image
          src={image}
          alt="logo"
          width={150}
          height={150}
          className={cn("max-sm:mx-auto", {
            'hidden': !logo,
          })}
        />
        <div className=" flex justify-between w-full md:max-w-fit ">
          <Phone color="red" className="" />
          {contact.map((item, i) => (
            <>
              <a href={`tel:${item}`}>
                <p className=" font-light text-slate-400 " key={i}>
                  {item}
                </p>
              </a>
            </>
          ))}
        </div>
        <div className=" flex gap-2 w-full justify-between md:max-w-fit">
          <Mail color="red" />
          <p className="font-light text-center  w-full text-slate-400">
            {email}
          </p>
        </div>
        <div className="flex gap-2 ">
          <div className="">
            <MapPin className="" color="red" />
          </div>
          <p className="font-light text-justify text-slate-400 max-w-xs">
            {address}
          </p>
        </div>
      </section>
    </>
  );
};

export default ContactCard;
