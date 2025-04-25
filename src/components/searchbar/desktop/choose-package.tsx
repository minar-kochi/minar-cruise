'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PackageSelectCard from "./package-select-card";
import { useClientSelector } from "@/hooks/clientStore/clientReducers";
import ChooseDateCard from "./choose-date-card";

export function ChoosePackage() {
  const packages = useClientSelector((state) => state.package.packages);
  const { selectedPackages } = useClientSelector((state) => state.package);

  return (
    <Popover>
      <PopoverTrigger className="hover:bg-primary/10 hover:rounded-r-full w-full rounded-l-full py-2 md:py-2.5 border-muted-foreground relative hidden md:flex items-start justify-center  ">
        <div className="">
          <h4 className=" text-left text-sm hidden md:block font-bold">Which</h4>
          <div className="md:text-sm text-muted-foreground flex font-semibold">
            {selectedPackages.length ? (
              <p className="">{selectedPackages.length} package selected</p>
            ) : (
              <p className=""> Choose a package</p>
            )}
          </div>
        </div>
        <div className="absolute h-10 w-[1px] top-auto bottom-auto right-0 bg-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent alignOffset={20} className="w-full  border-muted ">
        <div className="w-full  scrollbar-track-orange-lighter scrollbar-w-4 scrollbar-thumb-rounded h-full flex max-h-[40vh] overflow-y-scroll gap-2 flex-col">
          {packages
            ? packages
                .filter(
                  (fv) =>
                    fv.packageCategory !== "CUSTOM" &&
                    fv.packageCategory !== "EXCLUSIVE",
                )
                ?.map((item) => (
                  <PackageSelectCard
                    key={`choose-package-desktop=${item.id}`}
                    item={item}
                  />
                ))
            : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
