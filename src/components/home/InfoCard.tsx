import { list } from "postcss";
import Bounded from "../elements/Bounded";
import CompanyInfoCard from "./CompanyInfoCard";
import ContactCard from "./FooterContactCard";
import ExploreCard from "./ExploreCard";
import SubscribeCard from "./SubscribeCard";
import FooterItemCard from "../facilities/FooterItemCard";
import { cn } from "@/lib/utils";

// border flex max-md:flex-col justify-between pt-20

const InfoCard = ({ className }: { className?: string }) => {
  return (
    <>
      <div className={cn("flex flex-wrap max-sm:flex-col max-sm:items-center max-sm:gap-10 items-start justify-between py-12 mt-2", className)}>
        {/* <FooterItemCard/>         */}
        <ContactCard logo={true}/>
        <CompanyInfoCard className=""/>
        <ExploreCard className=""/>
        <SubscribeCard className=""/>
      </div>
    </>
  );
};

export default InfoCard;
