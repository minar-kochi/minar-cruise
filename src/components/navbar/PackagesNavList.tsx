import { db } from "@/db";
import { getPackageNavigation } from "@/db/data/dto/package";
import {
  NavigationMenuContent,
  NavigationMenuTrigger,
} from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import {
  ArrowBigDown,
  ArrowBigRight,
  ChevronDown,
  Droplet,
} from "lucide-react";

const PackagesNavList = async () => {
  const data = await getPackageNavigation();

  return (
    <div className="relative">
      <NavigationMenuTrigger className="flex my-auto ">
        <p>Packages</p>
        <ChevronDown className=" my-auto" size={15} />
      </NavigationMenuTrigger>
      <NavigationMenuContent className="absolute grid grid-cols-2 bg-white top-[50px] -left-52 w-[500px]">
        {data?.map((item) => {
          return (
            <>
              <Link href={item.slug} key={item.id}>
                <Button className="bg-white text-black rounded-none w-full">
                  {item.title}
                </Button>
              </Link>
            </>
          );
        })}
      </NavigationMenuContent>
    </div>
  );
};

export default PackagesNavList;

{/* <NavigationMenuItem className="">
  <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
  <NavigationMenuContent className="">
    <div className="grid w-[300px]  grid-cols-2  place-content-center gap-3 px-4 py-6">
      <NavigationMenuLink className="rounded-md p-2 hover:bg-gray-800/55 ">
        School
      </NavigationMenuLink>
      <NavigationMenuLink className="rounded-md p-2 hover:bg-gray-800/55 ">
        College
      </NavigationMenuLink>
      <NavigationMenuLink className="rounded-md p-2 hover:bg-gray-800/55 ">
        Business
      </NavigationMenuLink>
    </div>
  </NavigationMenuContent>
</NavigationMenuItem>; */}
