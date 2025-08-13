"use client";

import { trpc } from "@/app/_trpc/client";
import CruiseTicket, { TicketData } from "@/components/admin/dashboard/ticket/cruise-ticket";
import BoxReveal from "@/components/magicui/box-reveal";
import GradualSpacing from "@/components/magicui/gradual-spacing";
import RetroGrid from "@/components/magicui/RetroGrid";
import {
  TGetUserBookingDetailsExcludedNull,
  TRawGetUserBookingDetails,
} from "@/db/data/dto/booking";
import Link from "next/link";

interface ISearchParams {
  searchParams: {
    email: string;
    time: string;
    contact?: string;
    b_id?: string;
  };
}

export default function SuccessPage(params: ISearchParams) {
  const time = params.searchParams.time;

  const { data, isLoading } = trpc.user.getUserBookingDetails.useQuery(
    {
      bookingId: params.searchParams.b_id ?? "",
    },
    {
      refetchInterval({ state }) {
        let retryLoop = 0;
        if (retryLoop > 10) {
          return false;
        }
        if (!state.data) {
          retryLoop++;
          return 1000;
        }
        return false;
      },
    },
  );

  type GetUserTrpcType = typeof data
  function createBookingData({ data }: { data: GetUserTrpcType }) {
    const details: TicketData = {
      bookingId: data?.id ?? "",
      bookingDate: data?.createdAt.toString() ?? "",
      bookingMode: data?.payment.modeOfPayment ?? "",
      bookingPackage: data?.schedule.Package?.packageType ?? "",
      charges: {
        additionalCharges: 0,
        passengerCharges: {
          adult: data?.schedule.Package?.adultPrice ?? 720,
          children: data?.schedule.Package?.childPrice ?? 480,
          infant: 0,
        },
        totalFare: data?.payment.totalAmount ?? 0,
        vehicleCharges: 0,
      },
      contactNum: data?.user.contact ?? "",
      boardingTime: data?.schedule.Package?.fromTime ?? "",
      reportingTime: data?.schedule.Package?.fromTime ?? "",
      departureDate: data?.schedule.day.toString() ?? "",
      departureTime: data?.schedule.Package?.fromTime ?? "",
      emailId: data?.user.email ?? "",
      passengerDetails: [
        {
          firstName: data?.user.name ?? "",
          age: "",
          lastName: "",
          seatNo: "",
          srNo: 1,
          status: "",
        },
      ],
      passengers: {
        adult: data?.numOfAdults ?? 0,
        child: data?.numOfChildren ?? 0,
        infant: data?.numOfChildren ?? 0,
      },
    };

    return details;
  }

  let cruiseData: TicketData | null = null
  if (data) {
    cruiseData = createBookingData({ data: data });
  }
  return (
    <div className="relative min-h-screen flex flex-col justify-around items-center">
      {isLoading
        ? "loading..."
        : data
          ? `data received ${JSON.stringify(data)}`
          : "no data received"}
      {!isLoading && data ? <CruiseTicket data={cruiseData}/> : null}
      <div
        className="rounded-xl bg-slate-100 z-0  max-w-[400px] sm:max-w-[700px] w-full bg-transparent
         border-slate-200 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]"
      >
        {/* shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] */}
        {/* md:max-w-2xl md:z-10 md:shadow-lg md:absolute md:top-0 md:mt-48 lg:w-3/5 lg:left-0 lg:mt-20 lg:ml-20 xl:mt-24 xl:ml-12 */}
        <div className="flex flex-col p-12 md:px-16">
          <div className="">
            <GradualSpacing
              text="Booking Successful "
              className="font-bold text-2xl sm:text-4xl text-left "
              parentClassName="justify-left space-x-0"
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
              <p className="font-bold mt-3">
                See you at {params.searchParams.time}
              </p>
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
      <div className=""></div>
      <RetroGrid className="absolute top-0" />
    </div>
  );
}
