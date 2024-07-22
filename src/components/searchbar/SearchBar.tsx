"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TGetPackageSearchItems } from "@/db/data/dto/package";
import Image from "next/image";
import { Button } from "../ui/button";
import GuestLabel from "./GuestLabel";
import SearchLabel from "./SearchLabel";
import { Search } from "lucide-react";
import { useState } from "react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import {
  searchValidator,
  TSearchValidator,
} from "@/lib/validators/SearchFilterValidator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPrevTimeStamp } from "@/lib/utils";
import { PassengerCount } from "./PassengerCount";

const SearchBar = ({ packages }: { packages: TGetPackageSearchItems }) => {
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState(false);

  const {
    getValues,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TSearchValidator>({
    resolver: zodResolver(searchValidator),
    defaultValues: {
      date: Date.now(),
      adultCount: 0,
      babyCount: 0,
      childCount: 0,
    },
  });

  return (
    <form className="max-sm:hidden  bg-inherit flex justify-center items-center">
      <div className="bg-white shadow-[0px_1px_2px_0px_rgba(60,64,67,0.3),0px_2px_6px_2px_rgba(60,64,67,0.15)] my-5 m-3  w-[700px] h-[70px] rounded-full  flex  items-center tracking-wider">
        <Popover >
          <PopoverTrigger className="w-full h-full rounded-full">
            <div className=" h-full flex items-center">
              <SearchLabel
                label="Where"
                key={1}
                data={title || "Search packages"}
              />|
            </div>
          </PopoverTrigger>
          <PopoverContent className="outline-none border-0 shadow-2xl my-4 rounded-3xl w-[500px] bg-white">
            <div className="grid grid-cols-3 h-full gap-3">
              {packages?.map((item, i) => {
                return (
                  <button
                    className="hover:bg-primary hover:text-white font-bold p-2 rounded-lg w-full h-full flex flex-col gap-2 items-center text-center"
                    key={item.id + i}
                    onClick={() => {
                      setTitle(item.title);
                      setValue("packageId", item.id);
                    }}
                  >
                    <Image
                      src={
                        item?.packageImage[0]?.image.url ??
                        "/assets/nightPhoto.jpg"
                      }
                      alt={item?.packageImage[0]?.image.alt ?? "Night Photo"}
                      height={1920}
                      width={1080}
                      className="shadow-2xl rounded-xl object-cover max-h-[100px] max-w"
                    />
                    <div className="">{item.title}</div>
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger className="w-full h-full rounded-full">
            <div className="h-full flex items-center">
              <SearchLabel
                label="Date"
                key={2}
                data={
                  format(new Date(getValues("date")), "MMM dd, yyyy") ||
                  "Add dates"
                }
              />|
            </div>
          </PopoverTrigger>
          <PopoverContent className="bg-white rounded-3xl border-0 my-4">
            <Calendar
              mode="single"
              className="pl-0"
              selected={new Date(getValues("date"))}
              onSelect={async (selectedDate) => {
                if (selectedDate) {
                  setValue("date", selectedDate.getTime(), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
                return;
              }}
              disabled={(date) => {
                let currDate = getPrevTimeStamp(Date.now());
                return date < new Date(currDate);
              }}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger className="w-full h-full rounded-full">
            <div className="h-full flex items-center  relative">
              <SearchLabel label="Who" key={3} data="Add guests" className="" />
              <PassengerCount watch={watch} className="absolute right-5" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="outline-none border-0 shadow-2xl my-4 rounded-3xl w-[500px] bg-white">
            <GuestLabel
              label="Adults"
              desc="Ages 13 or above"
              register={register}
              type="adultCount"
              getValue={getValues}
              setValue={setValue}
              watch={watch}
            />
            <GuestLabel
              label="Children"
              desc="Ages 3 - 13"
              register={register}
              type="childCount"
              getValue={getValues}
              setValue={setValue}
              watch={watch}
            />
            <GuestLabel
              label="Baby"
              desc="Ages 3 or below"
              register={register}
              type="babyCount"
              getValue={getValues}
              setValue={setValue}
              watch={watch}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="">
      <Button
        type="submit"
        className="mr-5 active:bg-red-600 active:ring-2 ring-primary shadow-[0px_1px_2px_0px_rgba(60,64,67,0.3),0px_2px_6px_2px_rgba(60,64,67,0.15)] hover:shadow-xl  max-w-[150px] w- p-8 rounded-full  justify-between"
      >
        <Search strokeWidth={3} className="max-md: w-fit" />
        <p className="max-md:hidden block font-bold text-base">Search</p>
      </Button>
      </div>
      
    </form>
  );
};

export default SearchBar;
