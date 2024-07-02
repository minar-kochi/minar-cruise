import Image from "next/image";
import Link from "next/link";
import Bounded from "../elements/Bounded";
import NavigationContents from "./NavigationContents";
import { CloudCog } from "lucide-react";
import { log } from "console";

const Navbar = async () => {
  return (
    <div className="sticky top-0 w-full bg-white z-50 ">
      <Bounded
        as={"nav"}
        className="w-full flex justify-between h-16 items-center"
      >
        <div className="">
          <Link href={"/"}>
            <Image
              src={"/assets/logo.png"}
              alt="ship logo"
              width={150}
              height={100}
              priority={true}
            />
          </Link>  
        </div>
        <div className="w-full justify-end items-center hidden md:flex ">
          <NavigationContents/>
        </div> 
      </Bounded>
    </div>
  );
};

export default Navbar;

{
  /* 
  <NavigationMenuItem className="">
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
</NavigationMenuItem>; */
}

{
  /* <NavigationMenu className="border">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Packages</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <NavigationMenuLink>
                      {packageDetails.map((item) => {
                        return <>{item.title}</>;
                      })}
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu> */
}
