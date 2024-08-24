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
      <DropdownMenuItem>
        <Link href={`/admin/booking/update/${BookingId}`}>Update Schedule</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link
          href={{
            pathname: `/admin/booking/change/${BookingId}`,
            query: { scheduleId },
          }}
        >
          Change Schedule
        </Link>
      </DropdownMenuItem>
      <DeleteBookingButton BookingId={BookingId} ScheduleId={scheduleId} />
    </DropdownMenuContent>
  );
}
