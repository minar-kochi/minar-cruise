import { getPackageNavigation } from "@/db/data/dto/package";
import { cn } from "@/lib/utils";

import Link from "next/link";

const NavigationContents = async () => {
  const packageDetails = await getPackageNavigation();

  console.log(packageDetails);
  if (!packageDetails) {
    return (
      // TODO: #LOW - Add a alternative to Image Gallery if not found / empty
      <></>
    );
  }
  // TODO: enhance this navigation
  return (
    <div className="flex gap-9">
      <Link href="/" className="cursor-pointer  hover:text-red-500">
        Home
      </Link>

      <div className="relative group">
        <Link href="/" className="cursor-pointer  hover:text-red-500">
          Packages
        </Link>
        <div className="absolute pt-6 pb-3 px-5 rounded-lg hidden w-[250px] bg-white  shadow-lg z-10 group-hover:block">
          {packageDetails.map((item, i) => (
            <Link className="" key={item.id} href={`/booking/${item.slug}`}>
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

      <Link href="/" className="cursor-pointer  hover:text-red-500">
        Facilities
      </Link>
      <Link href="/" className="cursor-pointer  hover:text-red-500">
        About
      </Link>

      <div className="relative group">
        <Link href="/" className="cursor-pointer  hover:text-red-500">
          Gallery
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

      <Link href="/" className="cursor-pointer  hover:text-red-500">
        Contact
      </Link>
    </div>
  );
};

export default NavigationContents;
