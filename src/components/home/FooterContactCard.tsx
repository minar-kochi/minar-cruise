import { Mail, MapPin, Phone } from "lucide-react";
import { footer } from "@/constants/home/landingData";
import Image from "next/image";
import { cn } from "@/lib/utils";

const FooterContactCard = ({
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
            hidden: !logo,
          })}
        />
        <div className=" flex  w-full md:max-w- ">
          <Phone color="red" className="" />
            {contact.map((item, i) => (
              <>
                <a href={`tel:${item}`} key={item+i}>
                  <p className="pl-2 flex text-slate-400 font-semibold " >
                    {item}
                  </p>
                </a>
              </>
            ))}
        </div>
        <div className=" flex gap-2 w-full justify-between md:max-w-fit">
          <Mail color="red" />
          <p className=" text-center  w-full text-slate-400 font-semibold">
            {email}
          </p>
        </div>
        <div className="flex gap-2 ">
          <div className="">
            <MapPin className="" color="red" />
          </div>
          <p className=" text-justify text-slate-400 font-semibold max-w-xs">
            {address}
          </p>
        </div>
      </section>
    </>
  );
};

export default FooterContactCard;
