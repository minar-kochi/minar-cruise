import Image from "next/image";
import Link from "next/link";
import Bounded from "../elements/Bounded";
import NavigationContents from "./NavigationContents";
import MobileNavbar from "./MobileNavbar";
import { getPackageNavigation } from "@/db/data/dto/package";

const Navbar = async () => {
  const packages = await getPackageNavigation();

  return (
    <div className="sticky top-0 w-full bg-white z-50 shadow-sm">
      <Bounded
        as={"nav"}
        className="w-full flex justify-between md:justify-around h-16 items-center"
      >
        <div className="">
          <Link href={"/"}>
            <Image
              src={"/assets/logo.png"}
              alt="ship logo"
              width={120}
              height={100}
              priority={true}
            />
          </Link>
        </div>
        <div className="w-full justify-end items-center hidden md:flex ">
          <NavigationContents packages={packages} />
        </div>
        <div className="md:hidden ">
          <MobileNavbar packages={packages ?? []} />
        </div>
      </Bounded>
    </div>
  );
};

export default Navbar;
