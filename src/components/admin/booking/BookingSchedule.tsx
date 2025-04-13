"use client";

import { trpc } from "@/app/_trpc/client";
import LoadingState from "@/components/custom/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VIEW_BEFORE_PX } from "@/constants/config";
import { MAX_BOAT_SEAT } from "@/constants/config/business";
import { selectFromTimeAndToTimeFromScheduleOrPackages } from "@/lib/helpers/CommonBuisnessHelpers";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";

export default function BookingSchedule() {
  const router = useRouter();
  const {
    isLoading,
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
    <div>
      <Table className="max-sm:m-2 border">
        <TableHeader>
          <TableRow className="text-center">
            <TableHead className="border-r max-sm:text-[9px] text-center max-sm:text-balance center font-bold ">
              Date
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] text-center max-sm:text-balance center font-bold ">
              Day
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] text-center max-sm:text-balance center font-bold max-sm:hidden">
              Timing
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] text-center max-sm:text-balance center font-bold ">
              Package
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] text-center max-sm:text-balance center font-bold ">
              Booked seats
            </TableHead>
            <TableHead className="border-r max-sm:text-[9px] text-center max-sm:text-balance center font-bold ">
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
                <TableRow
                  ref={ref}
                  key={`${item.id}-booking-schedule-table`}
                  className="max-sm:text-[9px] text-center cursor-pointer"
                  onClick={() => router.push(`/admin/booking/view/${item.id}`)}
                >
                  <TableCell className="border-r max-sm:text-[9px] max-sm:p-0 max-sm:w-[60px] max-sm:py-2">
                    <p className="">{formattedDate}</p>
                  </TableCell>
                  <TableCell className="border-r max-sm:text-[9px] max-sm:p-0 max-sm:w-[60px]">
                    <p className="px-1">{formattedDay}</p>
                  </TableCell>
                  <TableCell className="border-r max-sm:text-[9px] max-sm:hidden">
                    {fromTime} - {toTime}
                  </TableCell>
                  <TableCell className="border-r max-sm:text-[9px] max-sm:w-[80px] max-sm:p-0">
                    <p className="mx-2">{item.Package?.title}</p>
                  </TableCell>
                  <TableCell className="border-r max-sm:text-[9px] max-sm:p-0 max-sm:w-[50px]">
                    {item.Booking}
                  </TableCell>
                  <TableCell className="border-r max-sm:text-[9px] max-sm:p-0 max-sm:w-[50px]">
                    {MAX_BOAT_SEAT - item.Booking}
                  </TableCell>
                  <TableCell className=" max-sm:text-[8px] p-0 max-sm:hidden"></TableCell>
                </TableRow>
              );
            });
          })}
        </TableBody>
      </Table>
      <div className="">
        {isLoading ? (
          <>
            <LoadingState />
          </>
        ) : null}
      </div>
    </div>
  );
}
