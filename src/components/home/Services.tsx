import Image from "next/image";
import Bounded from "../elements/Bounded";
import { services } from "@/constants/home/landingData";
import { Phone } from "lucide-react";

const Services = () => {
  const { contact, description, events, heading, subHeading } = services;
  return (
    <Bounded className="flex pt-32 gap-8 max-lg:flex-col">
      <article className="basis-[30%] space-y-7 ">
        <h1 className="text-4xl font-bold ">{heading}</h1>
        <h3 className="text-red-600 font-bold ">{subHeading}</h3>
        {description.map((item) => (
          <>
            <p className="font-medium text-justify">{item}</p>
          </>
        ))}
        <div className="flex gap-3 max-sm:flex-col">
          <Phone />
          {contact.map((item) => (
            <>
              <p className="font-bold">{item}</p>
            </>
          ))}
        </div>
      </article>
      <article className="basis-[70%] flex">
        {events.map((item, i) => (
          <>
            <div className="space-y-4" key={i}>
              <Image src={item.image} alt="" width={1000} height={1000} className="hover:scale-110 duration-300 rounded-md  hover:border-8 border-red-500"/>
              <h1 className="text-xl font-bold">{item.title}</h1>
              <p className="leading-8 text-lg ">{item.description}</p>
            </div>
          </>
        ))}
      </article>
    </Bounded>
  );
};

export default Services;
