import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

export default function ReachOutToUs() {
  return (
    <div className="w-full h-full flex bg-slate-100 flex-col  justify-center items-center pl-3 rounded-2xl gap-2 shadow-md text-black ">
      <p className="font-semibold leading-5 text-lg">
        Can&apos;t find the perfect package?
      </p>
      <p className="text-[11px] ">
        we&apos;ll create a personalized experience just for you!
      </p>
      <Link href="/contact">
        <Button className=" rounded-md transition-all duration-200" size={"xs"}>
          Reach out to us
        </Button>
      </Link>
    </div>
  );
}
