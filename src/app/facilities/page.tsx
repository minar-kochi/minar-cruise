import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import Entertainments from "@/components/home/Entertainments";
import Facilities from "@/components/home/Facilities";
import Footer from "@/components/home/Footer";
import Services from "@/components/home/Services";

const page = () => {
  return (
    <main>
      <FacilitiesImageCard label="Facilities"/>
      <Services />
      <Bounded>
        <Entertainments />
        <Facilities />
      </Bounded>
    </main>
  );
};

export default page;
