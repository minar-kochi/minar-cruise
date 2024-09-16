import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import { cn } from "@/lib/utils";
import { Bad_Script } from "next/font/google";
import ContactNumber from "@/components/contact/ContactNumber";
import ContactMessageCard from "@/components/contact/ContactMessageCard";
import ContactCard from "@/components/contact/ContactCard";
import MapView from "@/components/contact/MapView";
import { constructMetadata } from "@/lib/helpers/constructMetadata";

const badScript = Bad_Script({
  weight: "400",
  style: ["normal"],
  subsets: ["latin"],
});
export const metadata = constructMetadata({
  MetaHeadtitle: {
    default: "Contact Page",
    template: "%s | Minar Cruise",
  },
  description:
    "Contact admin or owner throught the easy contact form! Contact and schedule a exclusive booking right now!",
});
const page = () => {
  return (
    <div>
      <FacilitiesImageCard label="Contact" />
      <h5
        className={cn(
          "text-2xl text-primary  mx-auto w-fit",
          badScript.className,
        )}
      >
        Get in touch with us
      </h5>
      <Bounded className="my-10">
        <article className="grid md:grid-cols-2 gap-11 place-items-center lg:place-items-start">
          <ContactNumber />
          <ContactCard />
        </article>
        <ContactMessageCard />
        <div className="mt-2">
          <MapView />
        </div>
      </Bounded>
    </div>
  );
};

export default page;
