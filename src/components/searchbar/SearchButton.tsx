"use client";

import { useClientSelector } from "@/hooks/clientStore/clientReducers";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";

export default function SearchButton({ className }: { className?: string }) {
  const isPackageSelected = useClientSelector((state) => state.package);

  return (
    <div className={cn("min-w-44 sm:min-w-48 md:w-full rounded-r-full border p-2",className)}>
      <Link
        href={`/search?selected=${encodeURI(JSON.stringify(isPackageSelected.selectedPackages?.map((item) => item.id)))}`}
      >
        <div className="bg-primary h-full rounded-full mr-1.5 flex  text-md items-center w-full text-primary-foreground text-xs sm:text-sm justify-around font-bold px-2">
          {/* <div className=""> */}
            {/* {isPackageSelected.selectedPackages.length ? ( */}
              <p className="">
                Find your cruise 
                {/* {isPackageSelected.selectedPackages.length} */}
              </p>
            {/* ) : ( */}
              {/* <p className="">Search </p> */}
            {/* )} */}
          {/* </div> */}
          <Search className="text-primary size-[20px]" stroke="white" strokeWidth={3} />
        </div>
      </Link>
    </div>
  );
}

export function SearchButtonShad() {
  const isPackageSelected = useClientSelector((state) => state.package);

  return (
    <div className=" py-0 md:py-1.5 rounded-r-full w-full">
      <Link
        href={`/search?selected=${encodeURI(JSON.stringify(isPackageSelected.selectedPackages?.map((item) => item.id)))}`}
      >
        <div className="bg-primary/20 py-2 w-full font-semibold h-full rounded- mr-1.5 flex  text-md items-center pl-3 w-36 text-muted-foreground justify-center gap-3 px-2">
          <div className="">
            {isPackageSelected.selectedPackages.length ? (
              <p className="">
                Search {isPackageSelected.selectedPackages.length}
              </p>
            ) : (
              <p className="">Search </p>
            )}
          </div>
          <Search className="text-primary" size={28} />
        </div>
      </Link>
    </div>
  );
}
type TSearchPageButton = {
  callback: () => void;
};
export function SearchPageButton({ callback }: TSearchPageButton) {
  const isPackageSelected = useClientSelector((state) => state.package);
  return (
    <button
      onClick={() => callback()}
      className=" py-0 md:py-1.5 rounded-r-full w-full"
    >
      <div>
        <div className="bg-primary/20 py-2 w-full font-semibold h-full rounded- mr-1.5 flex  text-md items-center pl-3 w-36 text-muted-foreground justify-center gap-3 px-2">
          <div className="">
            {isPackageSelected.selectedPackages.length ? (
              <p className="">
                Search {isPackageSelected.selectedPackages.length}
              </p>
            ) : (
              <p className="">Search </p>
            )}
          </div>
          <Search className="text-primary" size={28} />
        </div>
      </div>
    </button>
  );
}
// <div className="h-full max-w-max   w-full  py-1 flex items-center flex-nowrap flex-grow  justify-end ">
//   <Link
//     href={`/search?selected=${encodeURI(JSON.stringify(isPackageSelected.selectedPackages?.map((item) => item.id)))}`}
//     className="flex-nowrap flex-grow flex-shrink-0"
//   >
// <div className="text-sm flex-shrink-0  flex gap-2 hover:bg-primary/20  font-medium pl-3  rounded-full px-2 xxs:px-5 py-2 sm:py-3 bg-primary/10">
//   <p className="">
//     {isPackageSelected.selectedPackages.length
//       ? `Search (${isPackageSelected.selectedPackages.length})`
//       : "Search All"}
//   </p>
//   <Search className="text-primary w-5 h-5" />
// </div>
//   </Link>
// </div>
