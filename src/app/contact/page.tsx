import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilitites/FacilitiesImageCard";
import { cn } from "@/lib/utils";
import { Bad_Script } from "next/font/google";
import { bookingNumber, contactInfo } from "@/constants/contact/contact";
import { Phone } from "lucide-react";
import ContactCard from "@/components/home/ContactCard";

const badScript = Bad_Script({
  weight: "400",
  style: ["normal"],
  subsets: ["latin"],
});

const page = () => {
  return (
    <div>
      <FacilitiesImageCard label="Contact" />
        <h5
          className={cn(
            "text-2xl text-primary border mx-auto w-fit",
            badScript.className
          )}
        >
          Get in touch with us
        </h5>
      <Bounded className="grid grid-cols-2 mt-10">
        <div className="border max-w-fit">
          <h3 className="font-bold text-2xl mb-6 border max-w-fit tracking-wider">For Booking</h3>
          {bookingNumber.map((item, i) => {
            return (
                <div className="flex items-center gap-3" key={item+i}>
                  <Phone size={15} className="bg-primary rounded-sm p-1" stroke="white" fill="white"/>
                  <p className="text-slate-500 font-normal">{item}</p>
                </div>
            );
          })}
        </div>
        <ContactCard logo={false}/>
        </Bounded>
    </div>
  );
};

export default page;
