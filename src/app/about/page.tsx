import AboutContentCard from "@/components/about/AboutContentCard";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";

const page = () => {
  return (
    <div>
      <FacilitiesImageCard label="About" />
      <AboutContentCard />
    </div>
  );
};

export default page;
