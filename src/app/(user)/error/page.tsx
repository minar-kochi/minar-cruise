"use client";
import Bounded from "@/components/elements/Bounded";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const ErrorPage = () => {
  //   const router = useRouter();
  //   const timerRef = useRef<NodeJS.Timeout>();
  //   useEffect(() => {
  //     timerRef.current = setTimeout(() => {
  //       router.push("/");
  //     }, 3000);

  //     return () => {
  //       clearTimeout(timerRef.current);
  //     };
  //   });
  return (
    <main className="bg-white overflow-hidden relative lgmd:static text-black">
      <div className=" mx-auto  ">
        <Image
          alt="404 error page"
          src={"/assets/404page.png"}
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-bottom  max-w-[100dvw] max-h-[100dvh] relative "
        />
      </div>
      <div className="flex flex-col items-center justify-center top-0  left-0 right-0 absolute lg:top-[15%] lg:left-[50%]">
        <p className="text-4xl sm:text-6xl md:text-[100px] font-semibold my-2">
          Oops!
        </p>
        <p className="text-lg font-semibold">
          The page you&apos;re looking for
        </p>
        <p className="text-xl sm:text-3xl font-semibold">
          Can&apos;t be <span className="text-[#DA0202]">found.</span>
        </p>
        <Link
          href="/"
          className={buttonVariants({
            className: "text-2xl mt-3",
          })}
        >
          Go Home
        </Link>
      </div>
    </main>
  );
};

export default ErrorPage;
