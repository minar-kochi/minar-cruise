"use client";
import { formatIstRange } from "@/lib/datetime";
import { convertScheduleDataDateToDateString } from "@/lib/helpers/organizedData";

import { trpc } from "@/app/_trpc/client";
import TableLoadingAnimation from "@/components/custom/skeltons/table-loading-animation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MAX_BOAT_SEAT } from "@/constants/config/business";
import { VIEW_BEFORE_PX } from "@/constants/config";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import { setScheduleForBooking } from "@/lib/features/schedule/ScheduleSlice";
import { formatDayKey } from "@/lib/datetime";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function BookingSchedule() {
  const dispatch = useAppDispatch();
  const { SchedulesWithBookingData } = useAppSelector(
    (state) => state.schedule,
  );

  // "Seats left" is capacity minus bookings, and capacity is admin-editable.
  const { data: bookingConfig } =
    trpc.admin.bookingConfig.getBookingConfig.useQuery();
  // MAX_BOAT_SEAT only covers the first render, before the query resolves.
  const maxBoatSeat = bookingConfig?.maxBoatSeat ?? MAX_BOAT_SEAT;

  const router = useRouter();
  const {
    isLoading,
    data: bookingSchedules,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = trpc.admin.booking.bookingScheduleInfinity.useInfiniteQuery(
    {},
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

  useEffect(() => {
    dispatch(
      setScheduleForBooking(
        bookingSchedules?.pages.map((page) => ({
          ...page,
          response: page.response.map(convertScheduleDataDateToDateString),
        })),
      ),
    );
  }, [bookingSchedules?.pages, dispatch]);

  const sortedScheduleArray = Object.entries(SchedulesWithBookingData).sort(
    ([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime(),
  );

  if (isLoading) {
    return <TableLoadingAnimation />;
  }
  return (
    <div className="rounded-md p-2 border m-2 ">
      <Table className="max-sm:m-2 bg-sidebar">
        <TableHeader className="md:text-lg bg-muted-foreground/10">
          <TableRow className="hover:bg-transparent ">
            <TableHead className=" h-16 max-sm:text-balance  font-bold ">
              Date
            </TableHead>
            <TableHead className=" h-16 max-sm:text-balance  font-bold  ">
              Day
            </TableHead>
            <TableHead className=" h-16 max-sm:text-balance max-sm:p-1 font-bold max-sm:hidden">
              Timing
            </TableHead>
            <TableHead className=" h-16 max-sm:text-balance  font-bold ">
              Package
            </TableHead>
            <TableHead className=" h-16 max-sm:text-balance max-sm:text-center max-sm:p-1 font-bold ">
              Booked seats
            </TableHead>
            <TableHead className=" h-16 max-sm:text-balance max-sm:text-center max-sm:p-1 font-bold ">
              Remaining seats
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {sortedScheduleArray &&
            sortedScheduleArray.map(([date, schedules], groupIndex) => (
              <React.Fragment key={`${groupIndex}`}>
                {schedules.map((schedule, index) => {
                  const formattedDate = formatDayKey(schedule.day, "dateMedium");
                  const formattedDay = formatDayKey(schedule.day, "weekday");
                  const timeSlot = formatIstRange(schedule.startsAt, schedule.endsAt);
                  return (
                    <TableRow
                      key={`${date}-${schedule.id}-${index}`}
                      onClick={() =>
                        router.push(`/admin/booking/view/${schedule.id}`)
                      }
                      className={`
                      ${index === 0 ? "border-t-0" : ""}
                      ${index === schedules.length - 1 ? "border-b" : "border-b-0"}
                      ${index === 0 && groupIndex !== 0 ? "border-0" : ""}
                       cursor-pointer  
                    `}
                    >
                      <TableCell className={`max-sm:p-1`}>
                        {index === 0 && formattedDate}
                      </TableCell>
                      <TableCell className={`max-sm:p-1`}>
                        {index === 0 && formattedDay}
                      </TableCell>
                      <TableCell className=" max-sm:hidden">
                        {timeSlot}
                      </TableCell>
                      <TableCell className=" max-lg:p-1">
                        <p className="">{schedule.Package?.title}</p>
                      </TableCell>
                      <TableCell className="max-sm:text-center max-sm:p-1">
                        {schedule.Booking}
                      </TableCell>
                      <TableCell className="max-sm:text-center ">
                        {maxBoatSeat - schedule.Booking}
                      </TableCell>
                      {/* <TableCell className=" max-sm:text-[8px] p-0 max-sm:hidden"></TableCell>{" "} */}
                    </TableRow>
                  );
                })}
              </React.Fragment>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
