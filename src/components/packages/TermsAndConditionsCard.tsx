import Bounded from "../elements/Bounded";
import { terms } from "@/constants/termsAndConditions/terms";
import TermsandConditions from "@/data/mdx/bookingpageT&C.mdx";

const TermsAndConditionsCard = () => {
  return (
    <Bounded className="prose my-12">
      <TermsandConditions />
    </Bounded>
  );
};

export default TermsAndConditionsCard;
