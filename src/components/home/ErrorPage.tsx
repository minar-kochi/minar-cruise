"use client";
import Image from "next/image";
import Bounded from "../elements/Bounded";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const ErrorPage = () => {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => {
      clearTimeout(timerRef.current);
    };
  });
  return (
    <main className="bg-black text-white py-10 min-h-screen">
      <div className="flex justify-center items-center flex-col ">
        <h1 className="text-9xl font-bold ">Oops!</h1>
        <p className="text-2xl font-semibold text-center mt-10">
          Your came in right place
          <br />
          but Wrong Time{" "}
        </p>
        <Image
          src={"/assets/404.png"}
          width={1280}
          height={1080}
          className="max-w-6xl -mt-28"
          alt="404"
        />
        <Button className="px-10 text-xl">Go Home</Button>
      </div>
    </main>
  );
};

export default ErrorPage;
