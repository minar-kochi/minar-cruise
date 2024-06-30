import Bounded from "../elements/Bounded";
import PackageCard from "./PackageCard";

const SuggestionCard = () => {
  return (
    <Bounded className="max-w-[2639px] w-full">
      <div className="flex gap-2 my-20 flex-wrap justify-center">
        <PackageCard />
        <PackageCard />
        <PackageCard />
        <PackageCard />
      </div>
    </Bounded>
  );
};

export default SuggestionCard;
