
import { Poppins } from "next/font/google";
import Bounded from "../elements/Bounded";
import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";



const AboutContentCard = () => {
  return (
    <Bounded className="">
        <Section1/>
        <Section2/>
        <Section3/>
    </Bounded>
  );
};

export default AboutContentCard;
