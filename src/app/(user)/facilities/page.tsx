import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import Entertainments from "@/components/home/Entertainments";
import Facilities from "@/components/home/Facilities";
import Footer from "@/components/footer/Footer";
import Services from "@/components/home/Services";
import { constructMetadata } from "@/lib/helpers/constructMetadata";
export const metadata = constructMetadata({
  MetaHeadtitle: {
    default: "Facilities",
    template: "% | Minar Cruise",
  },
});
const Page = () => {
  return (
    <main>
      <FacilitiesImageCard label="Facilities" />
      <Services />
      <Bounded>
        <Entertainments />
        <Facilities />
      </Bounded>
    </main>
  );
};

export default Page;
