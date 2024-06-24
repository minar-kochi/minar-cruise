import Bounded from "../elements/Bounded";
import CompanyInfoCard from "./CompanyInfoCard";
import ContactCard from "./ContactCard";
import ExploreCard from "./ExploreCard";
import SubscribeCard from "./SubscribeCard";

const InfoCard = () => {
  return (
    <>
      <div className="flex max-sm:flex-col justify-between pt-20">
        <ContactCard />
        <CompanyInfoCard />
        <ExploreCard/>
        <SubscribeCard />
      </div>
    </>
  );
};

export default InfoCard;
