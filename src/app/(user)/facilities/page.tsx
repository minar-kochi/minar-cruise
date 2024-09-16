import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import Entertainments from "@/components/home/Entertainments";
import Facilities from "@/components/home/Facilities";
import Services from "@/components/home/Services";
import { constructMetadata } from "@/lib/helpers/constructMetadata";
export const metadata = constructMetadata({
  MetaHeadtitle: {
    default: "Facilities",
    template: "% | Minar Cruise",
  },
}); // import Entertainments from "@/components/home/Entertainments";
// import Facilities from "@/components/home/Facilities";
// import Footer from "@/components/footerAmj/Footer";
// import Services from "@/components/home/Services";

const Page = () => {
  return (
    <main>
      <FacilitiesImageCard label="Facilities" />
      <Services />
      <Bounded>
        <Facilities />
        {/* <Entertainments /> */}
      </Bounded>
    </main>
  );
};

export default Page;
