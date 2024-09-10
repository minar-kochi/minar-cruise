import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";

export default function ReachOutToUs() {
  return (
    <Card className="bg-white border-none ">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg ">
          Can&apos;t find the perfect package?
        </CardTitle>
        <CardDescription>
          We&apos;ll craft a fully customized cruise experience tailored to your
          unique preferences and needs!{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          className={cn(
            buttonVariants({
              // size: "xs",
              className: "rounded-md transition-all duration-200",
            }),
          )}
          href="/contact"
        >
          {/* <Button
              className=" rounded-md transition-all duration-200"
              size={"xs"}
            > */}
          Reach out to us
        </Link>
      </CardContent>
    </Card>
  );
}
{
  /* <div className="w-full h-full flex bg-slate-100 flex-col  justify-center items-center pl-3 rounded-2xl gap-2 shadow-md text-black ">
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
</div> */
}
