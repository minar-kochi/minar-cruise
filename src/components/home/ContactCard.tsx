import { Mail, MapPin, Phone } from "lucide-react";
import { footer } from "@/constants/home/landingData";
import Image from "next/image";

const ContactCard = () => {
  const { contact, email, address, image } = footer;
  return (
    <>
      <section className="flex flex-col space-y-8  max-w-[25%]">
        <Image src={image} alt="logo" width={150} height={150} className="" />
        <div className=" flex gap-2  max-w-fit">
          <Phone color="red" className="" />
          {contact.map((item, i) => (
            <>
              <p className="font-light text-slate-400 " key={i}>
                {item}
              </p>
            </>
          ))}
        </div>
        <div className=" flex gap-2 max-w-fit">
          <Mail color="red" />
          <p className="font-light text-slate-400">{email}</p>
        </div>
        <div className="flex gap-2">
          <div className="">
            <MapPin className="" color="red" />
          </div>
          <p className="font-light text-slate-400">{address}</p>
        </div>
      </section>
    </>
  );
};

export default ContactCard;
