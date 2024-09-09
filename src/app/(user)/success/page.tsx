import CustomDialog from "@/components/custom/CustomDialog";
import BoxReveal from "@/components/magicui/box-reveal";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import RetroGrid from "@/components/magicui/RetroGrid";
import { db } from "@/db";
import { isProd, sleep } from "@/lib/utils";
import { indianPhoneRegex } from "@/lib/validators/offlineBookingValidator";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

interface ISearchParams {
  searchParams: {
    email: string;
    time: string;
    contact?: string;
  };
}
export default async function SuccessPage(params: ISearchParams) {
  if (
    (params.searchParams.contact &&
      !params.searchParams.contact.match(indianPhoneRegex)) ||
    !params.searchParams.email
  ) {
    redirect("/");
  }

  const time = params.searchParams.time;

  return (
    <div className="relative min-h-screen">
      <div
        className="bg-primary rounded-xl 
        bg-slate-100 z-0  max-w-lg shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] border-t-2
       border-slate-200 md:max-w-2xl md:z-10 md:shadow-lg md:absolute md:top-0 md:mt-48 lg:w-3/5 lg:left-0 lg:mt-20 lg:ml-20 xl:mt-24 xl:ml-12"
      >
        <div className="flex flex-col p-12 md:px-16">
          <div className="">
            <GradualSpacing
              text="Booking Successful "
              className="font-bold text-4xl text-left "
              parentClassName="justify-left"
            />
          </div>
          <BoxReveal duration={0.5} boxColor="#caccd9">
            <p className="mt-4">
              The booking details and additional information have been sent to
              your email address and phone number.
            </p>
          </BoxReveal>
          <BoxReveal boxColor="#caccd9">
            {time ? (
              <p className="font-bold mt-3">See you at {time}</p>
            ) : (
              <p className="font-bold mt-6">
                Thank You for choosing{" "}
                <span className="px-2  rounded-lg">MINAR!</span>
              </p>
            )}
          </BoxReveal>

          <div className="mt-8">
            <Link href={"/"}>
              <button className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-16 w-64 border text-left p-3 text-gray-50 text-base font-bold rounded-lg  overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg">
                Book more
              </button>
            </Link>
            {/* <Link href={"/"}>
              <p className="text-muted-foreground">Contact Us</p>
            </Link> */}
          </div>
        </div>
      </div>
      {/* <div className="absolute bottom-96 right-60">
        <Image
          alt=""
          src={"/assets/shipBack.png"}
          width={1920}
          height={1080}
          className="w-[500px]"
        />
      </div> */}
      <RetroGrid className="absolute top-0" />
    </div>
  );
}
