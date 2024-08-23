import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteBookingButton from "@/components/admin/booking/DeleteBookingButton";

export default function DropMenuClient({
  BookingId,
  scheduleId,
}: {
  BookingId: string;
  scheduleId: string;
}) {
  return (
    <DropdownMenuContent align="end" className="">
      {/* <Link href={{
        pathname:`/admin/booking/update/${BookingId}`,
        query: {scheduleId}
      }}>
        <DropdownMenuItem>Update</DropdownMenuItem>
      </Link> */}
      <Link href={`/admin/booking/update/${BookingId}`}>
        <DropdownMenuItem>Update</DropdownMenuItem>
      </Link>
      <Link
        href={{
          pathname: `/admin/booking/change/${BookingId}`,
          query: { scheduleId },
        }}
      >
        <DropdownMenuItem>Change Schedule</DropdownMenuItem>
      </Link>
      <DeleteBookingButton BookingId={BookingId} ScheduleId={scheduleId} />
    </DropdownMenuContent>
  );
}
