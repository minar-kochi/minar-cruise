import Bounded from "@/components/elements/Bounded";
import { Package } from "lucide-react";
import NormalPackages from "./NormalPackages";
import SpecialPackages from "./SpecialPackages";
import Image from "next/image";

export default function PackagesBento() {
  return (
    <Bounded>
      <section className="my-14 md:my-20">
        <h2 className="text-4xl text-[#0D3A62] font-semibold flex items-center my-5">
          <span className="mr-1">
            <Image
              alt="facilities"
              src="/assets/titleicons/box.svg"
              width={500}
              height={500}
              className="size-9 text-[#0D3A62]"
            />
          </span>
          Packages
        </h2>
        <div className="flex flex-col justify-center items-center gap-8 ">
          <NormalPackages />
          <SpecialPackages />
        </div>
      </section>
    </Bounded>
  );
}

//
