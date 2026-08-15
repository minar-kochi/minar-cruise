import { getSectionVisibility } from "@/lib/helpers/config/getSectionVisibility";
import { notFound } from "next/navigation";
import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import Entertainments from "@/components/home/Entertainments";
import Facilities from "@/components/home/Facilities";
import Services from "@/components/home/Services";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/helpers/constructMetadata";
export async function generateMetadata(): Promise<Metadata> {
  return await constructMetadata({
    MetaHeadtitle: {
      default: "Facilities",
      template: "% | Minar Cruise",
    },
  });
} // import Entertainments from "@/components/home/Entertainments";
// import Facilities from "@/components/home/Facilities";
// import Footer from "@/components/footerAmj/Footer";
// import Services from "@/components/home/Services";

const Page = async () => {
  // Hidden pages must 404, not just lose their nav link.
  const visible = await getSectionVisibility();
  if (!visible["page.facilities"]) notFound();

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
