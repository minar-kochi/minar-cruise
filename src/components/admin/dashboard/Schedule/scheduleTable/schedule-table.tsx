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
import { INFINITE_QUERY_LIMIT } from "@/constants/config";
import { selectFromTimeAndToTimeFromScheduleOrPackages } from "@/lib/helpers/CommonBuisnessHelpers";
import { RemoveTimeStampFromDate } from "@/lib/utils";
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
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>id</TableHead> */}
            <TableHead>Date</TableHead>
            <TableHead>Package Type</TableHead>
            <TableHead>From To</TableHead>
            <TableHead>Package Name</TableHead>
            <TableHead>Package Staus</TableHead>
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
                    <TableCell>{format(item.day, "dd/ MM /yyyy")}</TableCell>
                    <TableCell>{item.schedulePackage}</TableCell>
                    <TableCell>
                      {fromTime} - {toTime}
                    </TableCell>
                    <TableCell>{item.Package?.title}</TableCell>
                    <TableCell>{item.scheduleStatus}</TableCell>
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
