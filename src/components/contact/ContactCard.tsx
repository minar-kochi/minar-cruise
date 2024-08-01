import { Mail, MapPin, Phone } from "lucide-react";
import { footer } from "@/constants/home/landingData";
import { cn } from "@/lib/utils";
import { contactInfo } from "@/constants/contact/contact";

const ContactCard = ({ className }: { className?: string }) => {
  const { address, phone, email } = contactInfo;
  return (
    <>
      <section className={cn("flex flex-col max-md:", className)}>
        <h3 className="font-bold text-3xl mb-6 max-md:mx-auto">Reach Us at</h3>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 max-w-max items-center ">
            <Phone
              size={15}
              className="bg-primary rounded-sm p-1"
              stroke="white"
              fill="white"
            />
            {phone.map((item, i) => (
              <>
                <a href={`tel:${item}`}>
                  <p className=" flex text-slate-500" key={item + i}>
                    {item}
                  </p>
                </a>
              </>
            ))}
          </div>
          <div className="flex gap-3  ">
            <Mail size={20} stroke="white" fill="red" className="-ml-[2px]" />
            <p className="text-slate-500 text-center">{email}</p>
          </div>
          <div className="flex items-center  max-md:max-w-[250px] gap-3">
            <div className="">
              <MapPin
                fill="red"
                stroke="white"
                size={23}
                className="-ml-[4px]"
              />
            </div>
            <p className="w-fit text-slate-500 text-justify">{address}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactCard;
