import AboutContentCard from "@/components/about/AboutContentCard";
import FacilitiesImageCard from "@/components/facilitites/FacilitiesImageCard";

const page = () => {
  return (
    <div>
      <FacilitiesImageCard label="About" />
      <AboutContentCard />
    </div>
  );
};

export default page;
