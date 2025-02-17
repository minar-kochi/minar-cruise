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
import { selectFromTimeAndToTimeFromScheduleOrPackages } from "@/lib/helpers/CommonBuisnessHelpers";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const VIEW_BEFORE_PX = 50;

export default function ScheduleTable() {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: `${VIEW_BEFORE_PX}px 0px`,
    onChange(inView, entry) {
      if (inView) {
        fetchNextPage();
      }
    },
  });

  const { data, fetchNextPage, isFetching, isFetchingNextPage } =
    trpc.admin.schedule.getSchedulesInfinity.useInfiniteQuery(
      {},
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      },
    );

  if (isFetching) {
    return <LoadingState />;
  }
  return (
    <div className="mt-12 mx-auto">
      <Table className="border">
        <TableHeader className="">
          <TableRow className="">
            {/* <TableHead>id</TableHead> */}
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
              return page.response.map((item, i) => {
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
                    {/* <TableCell>{i}</TableCell> */}
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
                      <p className="max-sm:text-center">
                        {item.Package?.title}
                      </p>
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
      </Table>
      <div className="flex items-center justify-center mt-8">
        {isFetchingNextPage ? (
          <Loader2 className="w-12 h-12 animate-spin" />
        ) : null}
      </div>
    </div>
  );
}
