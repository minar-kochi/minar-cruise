import Image from "next/image";
import Link from "next/link";
import Bounded from "../elements/Bounded";
import NavigationContents from "./NavigationContents";

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