import Bounded from "../elements/Bounded";
import CopyRight from "./CopyRight";
import InfoCard from "../home/InfoCard";
import SocialCard from "../home/SocialCard";

const Footer = () => {
  return (
    <footer className="text-white bg-[#313041] ">
      <Bounded className="flex flex-col justify-evenly">
        <InfoCard />
        <CopyRight />
      </Bounded>
    </footer>
  );
};

export default Footer;
