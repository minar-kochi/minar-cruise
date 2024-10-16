import { TBookingDateSelector } from "@/db/data/dto/package";
import Bounded from "../elements/Bounded";
import HeroBookingDateSelector from "./HeroBookingDateSelector";
import HeroImageCard from "./HeroImageCard";

export default function HeroCard(formData: TBookingDateSelector) {
  return (
    <Bounded className="bg-white rounded-xl md:rounded-3xl md:p-12 md:flex">
      <HeroImageCard className="basis-[50%] lg:basis-[60%]" />
      <HeroBookingDateSelector
        className="basis-[50%] lg:basis-[40%]"
        formData={formData}
      />
    </Bounded>
  );
}
