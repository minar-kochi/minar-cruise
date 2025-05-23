"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useClientSelector } from "@/hooks/clientStore/clientReducers";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import ChooseDateCard from "./desktop/choose-date-card";
import PackageSelectCard from "./desktop/package-select-card";
import { SearchButtonShad } from "./SearchButton";

export default function SearchMobileBar({ className }: { className?: string }) {
  // const selected = useClientSelector((state) => ({
  //   selected: state.package.selectedPackages,
  //   date: state.package.date,
  // }));
  const selected = useClientSelector((state) => state.package.selectedPackages);
  const selectedDate = useClientSelector((state) => state.package.date);
  const packages = useClientSelector((state) => state.package.packages);
  return (
    <Drawer>
      <DrawerTrigger
        className={cn(
          "w-full rounded-l-full pl-7 py-2 md:py-3 h-14",
          className,
        )}
      >
        <div className="flex">
          <p className="text-sm font-medium md:text-sm line-clamp-1 text-muted-foreground">
            {selected.length
              ? `${selected.length} Package selected to filter in ${format(new Date(selectedDate ?? Date.now()), "MMMM")}`
              : "Filter package & date"}
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
        <SearchButtonShad />
      </DrawerContent>
    </Drawer>
  );
}
