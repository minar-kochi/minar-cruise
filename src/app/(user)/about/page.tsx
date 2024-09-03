import AboutContentCard from "@/components/about/AboutContentCard";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import { constructMetadata } from "@/lib/helpers/constructMetadata";

export const metadata = constructMetadata({
  title: "Privacy Policy | Minar Cruise",
  description:
    "About Home Page Our company COME AND FEEL THE SEA CRUISE EXPERIENCE WITH MINAR Minar Cruise is the 1st private catamaran sea cruise registered under INDIAN REGISTER OF SHIPPING at Kerala. We established with well hospitality and professional manner since 20 years. It is registered under the name Minar Tourist Boat Cochin & Traders. The Minar",
  alternates: {
    canonical: "https://cochincruiseline.com/about/",
  },
  // @TODO // add in more meta-tags and opengraphs specifically for this.
});

const Page = () => {
  return (
    <div>
      <FacilitiesImageCard label="About" />
      <AboutContentCard />
    </div>
  );
};

export default Page;
