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
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import { setScheduleForBooking } from "@/lib/features/schedule/ScheduleSlice";
import { selectFromTimeAndToTimeFromScheduleOrPackages } from "@/lib/helpers/CommonBuisnessHelpers";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function BookingSchedule() {
  const dispatch = useAppDispatch();
  const { SchedulesWithBookingData } = useAppSelector(
    (state) => state.schedule,
  );

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
    dispatch(setScheduleForBooking({ data: bookingSchedules?.pages }));
  }, [bookingSchedules?.pages, dispatch]);

  const sortedScheduleArray = Object.entries(SchedulesWithBookingData).sort(
    ([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime(),
  );

  return (
    <div className="p-2">
      <Table className="max-sm:m-2  dark:border-white border">
        <TableHeader className="dark:bg-muted-foreground/65 ">
          <TableRow className="hover:bg-transparent ">
            <TableHead className="border dark:border-white  dark:text-white   max-sm:text-balance center font-bold ">
              Date
            </TableHead>
            <TableHead className="border dark:border-white dark:text-white  max-sm:text-balance center font-bold ">
              Day
            </TableHead>
            <TableHead className="border dark:border-white dark:text-white  max-sm:text-balance center font-bold max-sm:hidden">
              Timing
            </TableHead>
            <TableHead className="border dark:border-white dark:text-white  max-sm:text-balance center font-bold ">
              Package
            </TableHead>
            <TableHead className="border dark:border-white dark:text-white  max-sm:text-balance center font-bold ">
              Booked seats
            </TableHead>
            <TableHead className="border dark:border-white dark:text-white  max-sm:text-balance center font-bold ">
              Remaining seats
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {sortedScheduleArray &&
            sortedScheduleArray.map(([date, schedules], groupIndex) => (
              <React.Fragment key={`${groupIndex}`}>
                {schedules.map((schedule, index) => {
                  const formattedDate = format(schedule.day, "dd-MMM-yy");
                  const formattedDay = format(schedule.day, "cccc");
                  const { fromTime, toTime } =
                    selectFromTimeAndToTimeFromScheduleOrPackages({
                      Packages: {
                        packageFromTime: schedule.Package?.fromTime ?? "",
                        packageToTime: schedule.Package?.toTime ?? "",
                      },
                      schedule: {
                        scheduleFromTime: schedule.fromTime,
                        scheduleToTime: schedule.toTime,
                      },
                    });
                  return (
                    <TableRow
                      key={`${date}-${schedule.id}-${index}`}
                      onClick={() =>
                        router.push(`/admin/booking/view/${schedule.id}`)
                      }
                      className={`
                      ${index === 0 ? "border-t-0" : ""}
                      ${index === schedules.length - 1 ? "border-b dark:border-white" : "border-b-0"}
                      ${index === 0 && groupIndex !== 0 ? "border-0" : ""}
                      dark:bg-muted cursor-pointer hover:bg-white 
                    `}
                    >
                      <TableCell className={`border-r dark:border-white`}>
                        {index === 0 && formattedDate}
                      </TableCell>
                      <TableCell className={`border-r dark:border-white`}>
                        {index === 0 && formattedDay}
                      </TableCell>
                      <TableCell className="border-r dark:border-white max-sm:text-[9px] max-sm:hidden">
                        {fromTime} - {toTime}
                      </TableCell>
                      <TableCell className="border-r dark:border-white max-sm:text-[9px] max-sm:w-[80px] max-sm:p-0">
                        <p className="">{schedule.Package?.title}</p>
                      </TableCell>
                      <TableCell className="border-r dark:border-white max-sm:text-[9px] max-sm:p-0 max-sm:w-[50px]">
                        {schedule.Booking}
                      </TableCell>
                      <TableCell className="border-r dark:border-white max-sm:text-[9px] max-sm:p-0 max-sm:w-[50px]">
                        {MAX_BOAT_SEAT - schedule.Booking}
                      </TableCell>
                      {/* <TableCell className=" max-sm:text-[8px] p-0 max-sm:hidden"></TableCell>{" "} */}
                    </TableRow>
                  );
                })}
              </React.Fragment>
            ))}
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

/**
 *           {bookingSchedules?.pages.map((pages) => {
            return pages.response.map((item: any) => {
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

 */
