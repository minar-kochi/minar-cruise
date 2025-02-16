"use client";

import { useClientSelector } from "@/hooks/clientStore/clientReducers";
import { Search } from "lucide-react";
import Link from "next/link";
import { ChoosePackage } from "./desktop/choose-package";
import SearchMobileBar from "./search-mobile-bar";
import { ChooseDates } from "./desktop/choose-date";

const SearchBar = () => {
  const isPackageSelected = useClientSelector((state) => state.package);
  return (
    <div className="flex items-center justify-center w-full ">
      <div className="w-full  max-w-md mx-auto  rounded-l-full rounded-r-full bg-white pr-3 pl-6 ">
        <div className="flex w-full  md:gap-0 justify-between items-center  md:grid md:grid-cols-[35%_35%_30%] md:place-content-center md:place-items-center">
          <ChoosePackage />
          <SearchMobileBar />
          <ChooseDates/>
          <div className="h-full max-w-max  w-full  py-1 flex items-center flex-nowrap flex-grow  justify-end ">
            <Link
              href={`/search?selected=${encodeURI(JSON.stringify(isPackageSelected.selectedPackages?.map((item) => item.id)))}`}
              className="flex-nowrap flex-grow flex-shrink-0"
            >
              <div className="text-sm flex-shrink-0  flex gap-2 hover:bg-primary/20  font-medium  rounded-full px-3 py-2 bg-primary/10">
                <p className="">
                  {isPackageSelected.selectedPackages.length
                    ? `Search (${isPackageSelected.selectedPackages.length})`
                    : "Search All"}
                </p>
                <Search className="text-primary w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
