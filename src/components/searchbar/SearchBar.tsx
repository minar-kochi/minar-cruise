import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import SetCalender from "./SetCalender";
import {
  getPackageNavigation,
  getPackageSearchItems,
  TGetPackageSearchItems,
} from "@/db/data/dto/package";
import Image from "next/image";
import { url } from "inspector";
import { Button } from "../ui/button";
import { isProd } from "@/lib/utils";
import GuestLabel from "./GuestLabel";
import SearchLabel from "./SearchLabel";
import { Search } from "lucide-react";

const SearchBar = async () => {
  const packages = await getPackageSearchItems();

  if (!packages) {
    if (isProd) {
      return <></>;
    }
    return <>PACKAGE FETCHING FAILED, CHECK: SearchBar.tsx</>;
  }

  const prodFeatured = packages.map((item) => {
    item.packageImage.map((i) => {
      i.image.ImageUse.map((u) => {
        u === "PROD_FEATURED";
      });
    });
  });

  if (prodFeatured)
    return (
      <div className=" bg-white flex justify-center items-center">
        <section className="shadow-[0px_1px_2px_0px_rgba(60,64,67,0.3),0px_2px_6px_2px_rgba(60,64,67,0.15)] my-5 m-3  w-[700px] h-[70px] rounded-full  flex  items-center tracking-wider">
          <Popover>
            <PopoverTrigger className=" hover:bg-gray-300 w-full  h-full rounded-full ">
              <div className="">
                <SearchLabel
                  label="Where"
                  key={1}
                  placeholder="Search packages"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="outline-none border-0 shadow-2xl mt-4 rounded-3xl w-[500px] bg-white">
              <div className="grid grid-cols-3 h-full gap-3">
                {packages.length > 0
                  ? packages?.map((item, i) => {
                      return (
                        <div
                          className="hover:bg-primary hover:text-white font-bold p-2 rounded-lg w-full h-full flex flex-col gap-2 items-center text-center"
                          key={item.id + i}
                        >
                          <Image
                            src={
                              prodFeatured &&
                              (item?.packageImage[0]?.image.url ??
                                "/assets/nightPhoto.jpg")
                            }
                            alt={
                              prodFeatured &&
                              (item?.packageImage[0]?.image.alt ??
                                "Night Photo")
                            }
                            height={1920}
                            width={1080}
                            className="shadow-2xl rounded-xl object-cover max-h-[100px] max-w"
                          />
                          <div className="">{item.title}</div>
                        </div>
                      );
                    })
                  : null}
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger className="hover:bg-neutral-200 w-full h-full rounded-full ">
              <div className="">
                <SearchLabel label="Date" key={2} placeholder="Add dates" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="bg-white rounded-3xl border-0 mt-4">
              <SetCalender />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger className="flex justify-evenly items-center hover:bg-neutral-200 w-full h-full rounded-full">
              <div className="">
                <SearchLabel label="Who" key={3} placeholder="Add guests" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="outline-none border-0 shadow-2xl mt-4 rounded-3xl w-[500px] bg-white">
              <GuestLabel label="Adults" desc="Ages 13 or above" />
              <GuestLabel label="Children" desc="Ages 2–12" />
            </PopoverContent>
          </Popover>
        </section>
        <Button className="h-[70px] min-w-[150px]  rounded-full flex justify-evenly">
          <Search strokeWidth={3}/>
          <p className="font-bold text-base">Search</p>
        </Button>
      </div>
    );
};

export default SearchBar;
