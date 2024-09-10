import { getPackageNavigation } from "@/db/data/dto/package";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";

const NavigationContents = async () => {
  const packageDetails = await getPackageNavigation();

  if (!packageDetails) {
    return (
      // TODO: #LOW - Add a alternative to Image Gallery if not found / empty
      <></>
    );
  }
  // TODO: enhance this navigation
  return (
    <div className="flex items-center gap-9">
      <Link href="/" className="cursor-pointer  hover:text-red-500">
        Home
      </Link>

      <div className="relative group">
        <Link
          href="/"
          className="cursor-pointer flex items-center hover:text-red-500 "
        >
          Packages
          <ChevronDown className="h-4 w-4 shrink-0  duration-200 " />
        </Link>
        <div className="absolute pt-6 pb-3 px-5 rounded-lg hidden w-[250px] bg-white  shadow-lg z-10 group-hover:block">
          {packageDetails.map((item, i) => (
            <Link className="" key={item.id} href={`/package/${item.slug}`}>
              <p className="hover:text-red-500 text-sm py-3">{item.title}</p>
              <hr
                className={cn("border-gray-200 group-last-of-type:hidden", {
                  hidden: i === packageDetails.length - 1,
                })}
              />
            </Link>
          ))}
        </div>
      </div>

      <Link href="/facilities" className="cursor-pointer  hover:text-red-500">
        Facilities
      </Link>
      <Link href="/about" className="cursor-pointer  hover:text-red-500">
        About
      </Link>

      <div className="relative group">
        <Link
          href="/"
          className="cursor-pointer flex items-center  hover:text-red-500"
        >
          Gallery
          <ChevronDown className="h-4 w-4 shrink-0  duration-200 " />
        </Link>
        <div className="absolute  py-3 px-5 rounded-lg hidden bg-white w-[250px] shadow-lg z-10 group-hover:block">
          <Link href="/gallery/family-gathering">
            <p className="hover:text-red-500 text-sm py-3">Family Gathering</p>
          </Link>
          <hr className="border-gray-200" />
          <Link href="/gallery/celebration-gathering">
            <p className="hover:text-red-500 text-sm py-3">
              Celebration Events
            </p>
          </Link>
          <hr className="border-gray-200" />
          <Link href="/gallery/corporate-gathering">
            <p className="hover:text-red-500 text-sm py-3">Corporate Events </p>
          </Link>
        </div>
      </div>

      <Link href="/contact" className="cursor-pointer  hover:text-red-500">
        Contact
      </Link>
      <Link
        href="/booking/premium-cruise"
        className={buttonVariants({
          className: "px-4  tracking-widest  text-xs rounded-full ",
          size: "sm",
        })}
      >
        BOOK NOW
      </Link>
    </div>
  );
};

export default NavigationContents;
