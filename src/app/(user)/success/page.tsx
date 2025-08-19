"use client";

import { trpc } from "@/app/_trpc/client";
import CruiseTicket from "@/components/admin/dashboard/ticket/cruise-ticket";
import CruiseTicketLoadingSkelton from "@/components/admin/dashboard/ticket/cruise-ticket-loading-skelton";
import { useRef } from "react";
import BookingError from "@/components/admin/dashboard/ticket/error";
import { X } from "lucide-react";

interface ISearchParams {
  searchParams: {
    email: string;
    time: string;
    contact?: string;
    b_id?: string;
  };
}

export default function SuccessPage(params: ISearchParams) {
  const retryRef = useRef(0);

  const { data, isLoading, isError } = trpc.user.getUserBookingDetails.useQuery(
    {
      bookingId: params.searchParams.b_id ?? "",
    },
    {
      refetchInterval({ state }) {
        if (retryRef.current > 1) {
          return false;
        }
        if (!state.data) {
          retryRef.current++;
          return 1000;
        }
        return false;
      },
    },
  );

  if (isLoading) {
    return <CruiseTicketLoadingSkelton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen">
        <div className="py-10 border w-fit mx-auto px-10 mt-4 rounded-md bg-primary/20">
          <h1 className="text-destructive text-xl font-bold w-fit mx-auto flex">
            <X className="w-8 h-8 rounded-full border-2 mx-2" />
            No booking record was found matching the specified booking ID
          </h1>
          <p className="text-destructive text-sm font-bold w-fit mx-auto">
            Make sure you have entered correct booking ID
          </p>
        </div>
      </div>
    );
  }

  if (data) {
    return <CruiseTicket data={data} />;
  }

  return <BookingError BookingId={params.searchParams.b_id} />;
}
