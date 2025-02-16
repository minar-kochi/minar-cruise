"use client";
import { trpc } from "@/app/_trpc/client";
import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";
import Bounded from "@/components/elements/Bounded";
import PackageSelectCard from "@/components/searchbar/desktop/package-select-card";
import SearchBar from "@/components/searchbar/SearchBar";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import {
  useClientDispatch,
  useClientSelector,
  useClientStore,
} from "@/hooks/clientStore/clientReducers";
import {
  setInitialSelectedPackage,
  setSearchedPackages,
} from "@/lib/features/client/packageClientSlice";
import { format } from "date-fns";
import React, { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { date } from "zod";

export default function SearchPageWrapper({
  selected: selectedIds,
}: {
  selected?: string[];
}) {
  const store = useClientStore();
  const initialized = useRef(false);

  if (!initialized.current && selectedIds?.length) {
    const packages = store.getState().package.searchPackages;
    const filteredPackages = packages?.filter((item) =>
      selectedIds.includes(item.id),
    );
    if (filteredPackages?.length) {
      store.dispatch(setInitialSelectedPackage(filteredPackages));
    }
    initialized.current = true;
  }
  // if(selected)
  const packages = useClientSelector((state) => state.package.searchPackages);
  const selectedPackages = useClientSelector(
    (state) => state.package.selectedPackages,
  );
  const clientDate = useClientSelector((state) => state.package.date);

  const { data: pages, fetchNextPage } =
    trpc.user.searchSchedules.useInfiniteQuery(
      {
        packageIds: selectedPackages?.map((item) => item.id) ?? undefined,
        clientDate: clientDate ?? undefined,
        limit: 5,
      },
      {
        getNextPageParam: (last) => {
          return last.nextCursor;
        },
      },
    );
  // hello.map(item => item.schedules.map(items => items.id))
  const dispatch = useClientDispatch();

  useEffect(() => {
    if (pages?.pages) {
      dispatch(setSearchedPackages(pages.pages));
    }
  }, [pages?.pages,dispatch]);

  const data = useClientSelector((state) => state.package.resultedSchedules);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: `${10}px 0px`,
    onChange(inView, entry) {
      if (inView) {
        fetchNextPage();
      }
    },
  });

  return (
    <Bounded>
      <HeaderTitleDescription
        title="Find your Trips!"
        description="Search trips in your convenance"
      />
      <SearchBar />
      <div className="flex items-center justify-center flex-col gap-4 max-w-md mx-auto">
        <div className="space-y-4 w-full">
          {Object.keys(data || {}).map((key) => (
            <div
              key={`${key}-search-date-query`}
              className="border rounded-lg p-4"
            >
              <h3 className="text-lg font-semibold mb-2">
                {format(new Date(key), "MMMM do, EEEE")}
              </h3>
              <div className="flex gap-2 flex-col">
                {data &&
                  data[key] &&
                  data[key]?.map((item) => {
                    const packageItem = packages?.find(
                      (fv) => fv.id === item.packageId,
                    );
                    if (!packageItem) return;
                    return (
                      <PackageSelectCard
                        key={`${key}-${packageItem.id}-${item.id}`}
                        item={packageItem}
                      />
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
        <div ref={ref} className="w-full h-2" />
        <Button
          className="mb-12"
          onClick={() => {
            fetchNextPage();
          }}
        >
          Show more
        </Button>
        {/* {data?.map(item => {
          return (
            <div>
              {item.day}
            </div>
          )
        })} */}
      </div>
    </Bounded>
  );
}
