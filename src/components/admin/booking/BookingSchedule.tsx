"use client";
import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TGetManySchedulesAndTotalBookingCount } from "@/db/data/dto/schedule";
import { Button } from "@/components/ui/button";
import CustomBookingBadge from "@/components/custom/CustomBookingBadge";
import { useInView } from "react-intersection-observer";
import { trpc } from "@/app/_trpc/client";
import Link from "next/link";
const VIEW_BEFORE_PX = 50;

export default function BookingScheduleTable() {
  const {
    data: schedules,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = trpc.admin.booking.bookingScheduleInfinity.useInfiniteQuery(
    { limit: null },
    {
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      
    },
  );
  const { ref } = useInView({
    threshold: 0,
    rootMargin: `${VIEW_BEFORE_PX}px 0px`,
    onChange(inView, entry) {
      if (inView) {
        fetchNextPage();
      }
    },
  });
  return (
    <Table className="border ">
      <TableHeader>
        <TableRow className="text-center">
          <TableHead className="text-center border">Date</TableHead>
          <TableHead className="text-center border">Day</TableHead>
          <TableHead className="text-center border">Timing</TableHead>
          <TableHead className="text-center border">Package</TableHead>
          <TableHead className="text-center border">Booked seats</TableHead>
          <TableHead className="text-center border">Remaining seats</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules?.pages.map((pages) => {
          return pages.response.map((item) => {
            const formattedDate = format(item.day, "MM/dd/yyyy");
            const formattedDay = format(item.day, "cccc");
            return (
              <>
                <TableRow
                  ref={ref}
                  key={`${item.id}-booking-schedule-table`}
                  className="text-center"
                >
                  <TableCell>{formattedDate}</TableCell>
                  <TableCell>{formattedDay}</TableCell>
                  <TableCell>
                    {item.fromTime} - {item.toTime}
                  </TableCell>
                  <TableCell>{item.Package?.title}</TableCell>
                  <TableCell>{item.Booking}</TableCell>
                  <TableCell>{150 - item.Booking}</TableCell>
                  <TableCell>
                    <Link href={`/admin/booking/view/${item.id}`}>
                      <Button className="">
                        <CustomBookingBadge
                          label="View Booking"
                          bookingId={""}
                        />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              </>
            );
          });
        })}
        {isFetching}
      </TableBody>
    </Table>
  );
}
