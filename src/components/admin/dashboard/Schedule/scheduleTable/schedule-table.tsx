"use client";

import { trpc } from "@/app/_trpc/client";
import LoadingState from "@/components/custom/Loading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import { setAllScheduleByDate } from "@/lib/features/schedule/ScheduleSlice";
import { selectFromTimeAndToTimeFromScheduleOrPackages } from "@/lib/helpers/CommonBuisnessHelpers";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const VIEW_BEFORE_PX = 50;

export default function ScheduleTable() {
  const dispatch = useAppDispatch();
  const groupedScheduleData = useAppSelector(
    (state) => state.schedule.AllSchedulesByDate,
  );
  const { data, fetchNextPage, isFetching, isFetchingNextPage, hasNextPage } =
    trpc.admin.schedule.getSchedulesInfinity.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      },
    );

  useEffect(() => {
    dispatch(setAllScheduleByDate(data?.pages));
  }, [dispatch, data?.pages]);

  const sortedEntries = Object.entries(groupedScheduleData).sort(
    ([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime(),
  );

  const getDayName = (dateStr: string) => {
    return format(new Date(dateStr), "EEEE");
  };

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: `${VIEW_BEFORE_PX}px 0px`,
    onChange(inView, entry) {
      if (inView) {
        fetchNextPage();
      }
    },
  });
  return (
    <div className="mt-12 mx-auto">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="border-b ">
              <TableHead className="w-[120px] border-r font-bold max-sm:text-[9px]">
                Date
              </TableHead>
              <TableHead className="w-[100px] border-r font-bold max-sm:text-[9px]">
                Day
              </TableHead>
              <TableHead className="w-[150px] border-r font-bold max-sm:text-[9px]">
                From To
              </TableHead>
              <TableHead className="border-r font-bold max-sm:text-[9px]">
                Package Name
              </TableHead>
              <TableHead className="w-[120px] border-r font-bold max-sm:text-[9px] max-sm:hidden">
                Package Type
              </TableHead>
              <TableHead className="w-[120px] font-bold max-sm:text-[9px]">
                Package Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedEntries.map(([date, schedules], groupIndex) => (
              <React.Fragment key={date}>
                {schedules.map((schedule, index) => {
                  const isBlocked = schedule.scheduleStatus === "BLOCKED";
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
                      className={`
                    ${index === 0 ? "border-t-0" : ""}
                    ${index === schedules.length - 1 ? "border-b" : "border-b-0"}
                    ${index === 0 && groupIndex !== 0 ? "border-" : ""}
                    ${isBlocked ? "bg-red-600/40" : ""}
                  `}
                    >
                      <TableCell
                        className={`
                      border-r max-sm:text-[9px] align-top
                      ${index === 0 ? "pt-4" : "pt-2"}
                      ${index === schedules.length - 1 ? "pb-4" : "pb-2"}
                    `}
                      >
                        {index === 0 && (
                          <div className="font-medium ">
                            {format(new Date(date), "dd/MM/yyyy")}
                          </div>
                        )}
                      </TableCell>
                      <TableCell
                        className={`
                      border-r max-sm:text-[9px] align-top
                      ${index === 0 ? "pt-4" : "pt-2"}
                      ${index === schedules.length - 1 ? "pb-4" : "pb-2"}
                    `}
                      >
                        {index === 0 && (
                          <div className="font-medium ">{getDayName(date)}</div>
                        )}
                      </TableCell>
                      <TableCell
                        className={`
                      border-r max-sm:text-[9px]
                      ${index === 0 ? "pt-4" : "pt-2"}
                      ${index === schedules.length - 1 ? "pb-4" : "pb-2"}
                    `}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="whitespace-nowrap">
                            {fromTime} - {toTime}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`
                      border-r max-sm:text-[9px]
                      ${index === 0 ? "pt-4" : "pt-2"}
                      ${index === schedules.length - 1 ? "pb-4" : "pb-2"}
                    `}
                      >
                        {schedule.Package?.title || "-"}
                      </TableCell>
                      <TableCell
                        className={`
                      border-r max-sm:text-[9px] max-sm:hidden
                      ${index === 0 ? "pt-4" : "pt-2"}
                      ${index === schedules.length - 1 ? "pb-4" : "pb-2"}
                    `}
                      >
                        {schedule.schedulePackage}
                      </TableCell>
                      <TableCell
                        className={`
                      max-sm:text-[9px]
                      ${index === 0 ? "pt-4" : "pt-2"}
                      ${index === schedules.length - 1 ? "pb-4" : "pb-2"}
                    `}
                      >
                        <span
                          className={`
                      inline-flex px-2 py-1 rounded-full text-xs font-medium
                      ${schedule.scheduleStatus === "AVAILABLE" ? "bg-green-100 text-green-700" : ""}
                      ${schedule.scheduleStatus === "EXCLUSIVE" ? "bg-yellow-100 text-yellow-700" : ""}
                      ${schedule.scheduleStatus === "BLOCKED" ? "bg-red-100 text-red-700" : ""}
                    `}
                        >
                          {schedule.scheduleStatus}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </React.Fragment>
            ))}
            {sortedEntries.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-slate-500"
                >
                  No schedules found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div ref={ref} className="w-full h-1" />
      <div className="flex items-center justify-center mt-8">
        {isFetchingNextPage ? (
          <Loader2 className="w-12 h-12 animate-spin" />
        ) : null}
      </div>
      {hasNextPage ? (
        <div className="flex items-center justify-center">
          <Button
            onClick={() => {
              fetchNextPage();
            }}
          >
            Load more
          </Button>
        </div>
      ) : null}
    </div>
  );
}

{
  /* <Table className="border">
  <TableHeader className="">
    <TableRow className="">
      <TableHead className="border-r font-bold max-sm:text-[9px] ">
        Date
      </TableHead>
      <TableHead className="border-r font-bold max-sm:text-[9px] ">
        Day
      </TableHead>
      <TableHead className="border-r font-bold max-sm:text-[9px] ">
        From To
      </TableHead>
      <TableHead className="border-r font-bold max-sm:text-[9px] ">
        Package Name
      </TableHead>
      <TableHead className="border-r font-bold max-sm:text-[9px]  max-sm:hidden">
        Package Type
      </TableHead>
      <TableHead className="font-bold max-sm:text-[9px] ">
        Package Status
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody className="">
    {data &&
      data.pages?.length &&
      data.pages.map((page) => {
        return page.schedules.map((item, i) => {
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
            <TableRow ref={ref} key={`${item.id}-table-row`} className="">
              <TableCell className="border-r  max-sm:w-[70px] max-sm:text-[9px] p-0">
                <p className="text-nowrap max-sm:text-center max-sm:px-0 px-4">
                  {format(item.day, "dd/ MMM / yy")}
                </p>
              </TableCell>
              <TableCell className="border-r  max-sm:text-[9px] max-sm:text-pretty  max-sm:px-1">
                {format(item.day, "EEEE")}
              </TableCell>
              <TableCell className=" border-r  max-sm:text-[9px] max-sm:w-[110px] max-sm:p-0 max-sm:text-center">
                <p className="">
                  {fromTime} - {toTime}
                </p>
              </TableCell>
              <TableCell className="border-r  max-sm:text-[9px] max-sm:text-pretty max-sm:p-0">
                <p className="max-sm:text-center">{item.Package?.title}</p>
              </TableCell>
              <TableCell className="border-r  max-sm:text-[9px] max-sm:text-pretty max-sm:hidden">
                {item.schedulePackage}
              </TableCell>
              <TableCell className=" max-sm:text-[9px] max-sm:text-pretty">
                {item.scheduleStatus}
              </TableCell>
            </TableRow>
          );
        });
      })}
  </TableBody>
</Table>; */
}
