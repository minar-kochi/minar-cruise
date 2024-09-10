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
    <>
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
          { schedules?.pages.map((pages) => {
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
                    onClick={() =>
                      router.push(`/admin/booking/view/${item.id}`)
                    }
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
                    <TableCell className="max-sm:text-[8px] p-0 "></TableCell>
                  </TableRow>
                );
              });
            })}
        </TableBody>
      </Table>
      {isLoading ? (
        <>
          <LoadingState />
        </>
      ) : null}
    </>
  );
}
