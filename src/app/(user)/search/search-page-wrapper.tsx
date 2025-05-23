"use client";
import { trpc } from "@/app/_trpc/client";
import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";
import Bounded from "@/components/elements/Bounded";
import PackageSelectCard from "@/components/searchbar/desktop/package-select-card";
import SearchBar from "@/components/searchbar/SearchBar";
import { Button, buttonVariants } from "@/components/ui/button";
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
import PackageCardViewer from "./package-card-viewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSunsetPackage } from "@/lib/features/client/packageClientSelectors";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  CheckCircle2,
  Compass,
  GhostIcon,
  Search,
  Ship,
} from "lucide-react";
import NoSearchFound from "./no-search-found";

export default function SearchPageWrapper({
  selected: selectedIds,
}: {
  selected?: string[];
}) {
  const store = useClientStore();
  const initialized = useRef(false);

  if (!initialized.current && selectedIds?.length) {
    const packages = store.getState().package.packages;
    const filteredPackages = packages?.filter((item) =>
      selectedIds.includes(item.id),
    );
    if (filteredPackages?.length) {
      store.dispatch(setInitialSelectedPackage(filteredPackages));
    }
    initialized.current = true;
  }
  // if(selected)
  const packages = useClientSelector((state) => state.package.packages);
  const sunsetPackage = useClientSelector(getSunsetPackage);
  const selectedPackages = useClientSelector(
    (state) => state.package.selectedPackages,
  );
  const clientDate = useClientSelector((state) => state.package.date);

  const {
    data: pages,
    fetchNextPage,
    hasNextPage,
  } = trpc.user.searchSchedules.useInfiniteQuery(
    {
      packageIds: selectedPackages?.map((item) => item.id) ?? undefined,
      clientDate: clientDate ?? undefined,
      limit: 12,
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
  }, [pages?.pages, dispatch]);

  const data = useClientSelector((state) => state.package.resultedSchedules);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: `${10}px 0px`,
    onChange(inView, entry) {
      if (inView) {
        // fetchNextPage();
      }
    },
  });

  return (
    <Bounded>
      <HeaderTitleDescription
        title="Find your Cruise!"
        description="Search trips in your convenance"
      />
      <div className="mb-2">
        <SearchBar />
      </div>
      <div className="my-6 mx-auto ">
        {sunsetPackage ? (
          <div className="flex justify-between max-w-md mx-auto md:max-w-full flex-col-reverse md:flex-row bg-white rounded-xl overflow-hidden  ">
            <Card className="bg-white border-muted border-none max-w-2xl">
              <CardHeader className="pb-2">
                <CardTitle>Sunset cruise is available everyday day</CardTitle>
                <CardDescription className="max-w-prose">
                  {sunsetPackage.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2 ">
                <div className="grid w-full  py-2 grid-cols-2 place-content-between place-items-stretch gap-y-4     ">
                  {sunsetPackage.amenities.description
                    .slice(0, 4)
                    .map((item, i) => {
                      return (
                        <div
                          key={`${item}-${i}-amenities-description`}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0  stroke-red-500" />
                          <p
                            key={`${item}-${i}`}
                            className="line-clamp-1 xxs:text-sm md:text-base text-xs   "
                          >
                            <span>{item}</span>
                          </p>
                        </div>
                      );
                    })}
                </div>
                <Link
                  className={buttonVariants({})}
                  href={`/package/${sunsetPackage.slug}`}
                >
                  <p>Sunset cruise -{">"}</p>
                </Link>
              </CardContent>
            </Card>
            <Image
              className="aspect-[16/9]  md:max-w-sm object-cover"
              src={
                sunsetPackage?.packageImage[0]?.image?.url ??
                "/assets/world-map.png"
              }
              alt={sunsetPackage?.packageImage[0]?.image?.alt ?? ""}
              width={720}
              height={480}
              loading="eager"
            />
          </div>
        ) : null}
      </div>
      <div className="flex items-center justify-center flex-col gap-4  mx-auto">
        <div className="space-y-4 w-full bg-white rounded-md  lg:px-4 px-2 py-2">
          {Object.keys(data).length ? (
            Object.keys(data || {}).map((key) => (
              <div
                key={`${key}-search-date-query`}
                className=" rounded-lg px-1 py-1 xxs:p-2  lg:p-4"
              >
                <h3 className="text-xl font-medium mb-2">
                  {format(new Date(key), "MMMM do, EEEE")}
                </h3>
                <div className="grid sm:grid-cols-2 md:flex gap-2   md:flex-col lg:px-6">
                  {data &&
                    data[key] &&
                    data[key]?.map((item) => {
                      const packageItem = packages?.find(
                        (fv) => fv.id === item.packageId,
                      );
                      if (!packageItem) return;
                      return (
                        <PackageCardViewer
                          key={`${key}-${packageItem.id}-${item.id}`}
                          item={packageItem}
                          schedules={item}
                        />
                      );
                    })}
                </div>
              </div>
            ))
          ) : (
            <NoSearchFound />
          )}
        </div>
        <div ref={ref} className="w-full h-2" />
        {hasNextPage ? (
          <Button
            className="mb-12"
            onClick={() => {
              fetchNextPage();
            }}
          >
            Show more
          </Button>
        ) : null}
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
