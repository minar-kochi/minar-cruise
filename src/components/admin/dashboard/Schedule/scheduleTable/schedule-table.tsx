"use client";

import { trpc } from "@/app/_trpc/client";
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

  return (
    <div className="  mt-12 mx-auto">
      <Table>
        <TableHeader>
          <TableRow className="">
            {/* <TableHead>id</TableHead> */}
            <TableHead className="max-sm:text-[9px]">Date</TableHead>
            <TableHead className="max-sm:text-[9px]">Day</TableHead>
            <TableHead className="max-sm:text-[9px]">From To</TableHead>
            <TableHead className="max-sm:text-[9px]">Package Name</TableHead>
            <TableHead className="max-sm:text-[9px] max-sm:hidden">
              Package Type
            </TableHead>
            <TableHead className="max-sm:text-[9px]">Package Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
                  <TableRow ref={ref} key={`${item.id}-table-row`}>
                    {/* <TableCell>{i}</TableCell> */}
                    <TableCell className="max-w-[100px]  min-w-[100px] max-sm:text-[9px] ">
                      <p className="text-nowrap">{format(item.day, "dd/ MMM / yy")}</p>
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:text-pretty">
                      {format(item.day, "EEEE")}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:text-left">
                      {fromTime} - {toTime}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:text-pretty">
                      {item.Package?.title}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:text-pretty max-sm:hidden">
                      {item.schedulePackage}
                    </TableCell>
                    <TableCell className="max-sm:text-[9px] max-sm:text-pretty">
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
