import Image from "next/image";
import Link from "next/link";
import Bounded from "../elements/Bounded";

const Navbar = () => {
  return (
    <div className="sticky  py-4 top-0 w-full  bg-white z-50">
      <Bounded as={"nav"} className="w-full flex justify-between">
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
        <div className="flex gap-5 font-sans font-medium justify-start max-md:hidden">
          <Link href={""}>
            <h1>Home</h1>
          </Link>
          <h1>Packages</h1>
          <h1>Facilities</h1>
          <h1>About</h1>
          <h1>Gallery</h1>
          <h1>Contact</h1>
        </div>
      </Bounded>
    </div>
  );
};

export default Navbar;
