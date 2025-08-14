"use client";

import { trpc } from "@/app/_trpc/client";
import CruiseTicket, {
  TicketData,
} from "@/components/admin/dashboard/ticket/cruise-ticket";
import CruiseTicketLoadingSkelton from "@/components/admin/dashboard/ticket/cruise-ticket-loading-skelton";
import { useRef, useState } from "react";
import BookingError from "@/components/admin/dashboard/ticket/error";

interface ISearchParams {
  searchParams: {
    email: string;
    time: string;
    contact?: string;
    b_id?: string;
  };
}

export default function SuccessPage(params: ISearchParams) {
  // const [loadingState, setLoadingState] = useState<boolean>(true);
  const retryRef = useRef(0);

  const { data, isLoading } = trpc.user.getUserBookingDetails.useQuery(
    {
      bookingId: params.searchParams.b_id ?? "",
    },
    {
      refetchInterval({ state }) {
        if (retryRef.current > 10) {
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

  return (
    <div className="min-h-screen">
      {!isLoading && data ? <CruiseTicket data={data} /> : null}
      {isLoading ? <CruiseTicketLoadingSkelton /> : null}
      {!isLoading && !data ? (
        <BookingError BookingId={params.searchParams.b_id} />
      ) : null}
    </div>
  );
}
