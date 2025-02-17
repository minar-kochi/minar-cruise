import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useClientSelector } from "@/hooks/clientStore/clientReducers";
import PackageSelectCard from "./desktop/package-select-card";
import ChooseDateCard from "./desktop/choose-date-card";
import { format } from "date-fns";

export default function SearchMobileBar() {
  // const selected = useClientSelector((state) => ({
  //   selected: state.package.selectedPackages,
  //   date: state.package.date,
  // }));
  const selected = useClientSelector(state => state.package.selectedPackages)
  const selectedDate = useClientSelector(state => state.package.date)
  const packages = useClientSelector((state) => state.package.packages);
  return (
    <Drawer>
      <DrawerTrigger className="w-full py-2 md:py-3 md:hidden ">
        <div className="flex">
          <p className="text-sm font-medium md:text-sm textd-muted-foreground">
            Filter package & date
          </p>
        </div>
      </DrawerTrigger>

      <DrawerContent className="z-[100]">
        <DrawerHeader>
          <DrawerTitle className="sr-only">Welcome to search bar</DrawerTitle>
          <DrawerDescription className="text-center text-base font-medium">
            {!selected.length
              ? `Search and Filter your cruise in ${format(new Date(selectedDate ?? Date.now()), "MMMM")}`
              : `You have selected ${selected.length} packages to filter in ${format(new Date(selectedDate ?? Date.now()), "MMMM")}`}
          </DrawerDescription>
        </DrawerHeader>
        <ChooseDateCard />

        <div>
          <div className="w-full pb-12 pt-6 px-4 scrollbar-track-orange-lighter scrollbar-w-4 scrollbar-thumb-rounded h-full flex max-h-[50vh] overflow-y-scroll gap-2 flex-col">
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
        </div>
      </DrawerContent>
    </Drawer>
  );
}
