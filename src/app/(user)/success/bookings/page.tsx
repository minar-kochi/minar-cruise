"use client";

import { trpc } from "@/app/_trpc/client";
import CruiseTicket from "@/components/admin/dashboard/ticket/cruise-ticket";
import CruiseTicketLoadingSkelton from "@/components/admin/dashboard/ticket/cruise-ticket-loading-skelton";
import Bounded from "@/components/elements/Bounded";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TGetUserBookingDetails } from "@/db/data/dto/booking";
import {
  BookingCuidValidator,
  TBookingCuidValidator,
} from "@/lib/validators/Booking";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ISearchParams {
  searchParams: {
    b_id?: string;
  };
}

export default function Bookings({ searchParams: { b_id } }: ISearchParams) {
  const [userBookingId, setUserBookingId] = useState(b_id);
  const { data, status, isLoading } = trpc.user.getUserBookingDetails.useQuery(
    {
      bookingId: userBookingId ?? "",
    },
    {
      enabled: !!userBookingId,
    },
  );

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<TBookingCuidValidator>({
    resolver: zodResolver(BookingCuidValidator),
    defaultValues: {
      bookingId: b_id ?? "",
    },
  });

  async function HandleFormSubmit(values: TBookingCuidValidator) {
    setUserBookingId(values.bookingId);
  }

  return (
    <div className="min-h-screen">
      <Bounded>
        <h2 className="text-4xl font-bold mx-auto w-fit mt-14">
          Find Booking Details
        </h2>
        <form
          onSubmit={handleSubmit(HandleFormSubmit)}
          className="max-w-[650px] mt-10  mx-auto  flex gap-2"
        >
          <div className=" w-full">
            <Input
              placeholder="Booking ID"
              {...register("bookingId")}
              className="w-full"
            />
            <p className="pt-2">{errors.bookingId?.message}</p>
          </div>
          <Button>Search Booking</Button>
        </form>
        {data ? (
          <CruiseTicket data={data} />
        ) : isLoading ? (
          <CruiseTicketLoadingSkelton size="sm" />
        ) : null}
        {status === "success" && !data && !isLoading ? <p className="mx-auto w-fit">no data found</p> : null}
      </Bounded>
    </div>
  );
}
