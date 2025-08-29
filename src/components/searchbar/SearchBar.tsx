import { ChooseDates } from "./desktop/choose-date";
import { ChoosePackage } from "./desktop/choose-package";
import SearchMobileBar from "./search-mobile-bar";
import SearchButton from "./SearchButton";

const SearchBar = () => {
  return (
    <div className=" flex items-center justify-center w-full">
      <div className="w-full mx-3 shadow-xl rounded-full bg-white max-w-[550px] flex md:h-16  ">
        <ChoosePackage className=" basis-[38%] hidden md:flex" />
        <ChooseDates className="basis-[28%] hidden md:flex" />
        <SearchMobileBar className="md:hidden" />
        <SearchButton className="md:basis-1/3" />
      </div>
    </div>
  );
};

export default SearchBar;

{
  /* <div className=" flex items-center justify-center w-full ">
<div className="w-full  mx-auto  ml-2 mr-2 rounded-l-full rounded-r-full bg-white pr-1 pl-2 xxs:pr-2 xxs:pl-6 max-w-[500px]">
  <div className="flex pl-1  w-full  md:gap-0   justify-between items-center  md:grid md:grid-cols-[35%_35%_30%] md:place-content-center md:place-items-center">
    <ChoosePackage />
    <SearchMobileBar className="md:hidden" />
    <ChooseDates />
    <SearchButton />
  </div>
</div>
</div> */
}
