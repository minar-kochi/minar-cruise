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
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { selectFromTimeAndToTimeFromScheduleOrPackages } from "@/lib/helpers/CommonBuisnessHelpers";
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
  const router = useRouter();
  return (
    <Table className="max-sm:m-2">
      <TableHeader>
        <TableRow className="text-center">
          <TableHead className="max-sm:text-[9px] text-center max-sm:text-balance center font-bold ">
            Date
          </TableHead>
          <TableHead className="max-sm:text-[9px] text-center max-sm:text-balance center font-bold ">
            Day
          </TableHead>
          <TableHead className="max-sm:text-[9px] text-center max-sm:text-balance center font-bold max-sm:hidden">
            Timing
          </TableHead>
          <TableHead className="max-sm:text-[9px] text-center max-sm:text-balance center font-bold ">
            Package
          </TableHead>
          <TableHead className="max-sm:text-[9px] text-center max-sm:text-balance center font-bold ">
            Booked seats
          </TableHead>
          <TableHead className="max-sm:text-[9px] text-center max-sm:text-balance center font-bold ">
            Remaining seats
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules?.pages.map((pages) => {
          return pages.response.map((item) => {
            const formattedDate = format(item.day, "dd-MMM-yy");
            const formattedDay = format(item.day, "cccc");
            const { fromTime, toTime } =
            selectFromTimeAndToTimeFromScheduleOrPackages({
              Packages: {
                packageFromTime: item.Package?.fromTime ?? "",
                packageToTime: item.Package?.toTime ?? "",
              },
              schedule: {
                scheduleFromTime: item.fromTime,
                scheduleToTime: item.toTime,
              },
            });
            return (
              <>
                <TableRow
                  ref={ref}
                  key={`${item.id}-booking-schedule-table`}
                  className="max-sm:text-[9px] text-center"
                  onClick={() => router.push(`/admin/booking/view/${item.id}`)}
                >
                  <TableCell className="max-sm:text-[9px] max-sm:p-0">
                    {formattedDate}
                  </TableCell>
                  <TableCell className="max-sm:text-[9px] ">
                    {formattedDay}
                  </TableCell>
                  <TableCell className="max-sm:text-[9px] max-sm:hidden">
                    {fromTime} - {toTime}
                  </TableCell>
                  <TableCell className="max-sm:text-[9px] max-sm:p-0 max-sm:text-balance">
                    {item.Package?.title}
                  </TableCell>
                  <TableCell className="max-sm:text-[9px] ">
                    {item.Booking}
                  </TableCell>
                  <TableCell className="max-sm:text-[9px] max-sm:p-0">
                    {150 - item.Booking}
                  </TableCell>
                  <TableCell className="max-sm:text-[8px] p-0 ">
                    <Link href={`/admin/booking/view/${item.id}`}>
                      {/* <Button className="max-sm:block hidden  p-0">
                        view
                      </Button> */}
                      <Button className="max-sm:hidden">
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
