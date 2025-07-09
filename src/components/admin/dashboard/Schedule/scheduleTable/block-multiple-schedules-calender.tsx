"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn, RemoveTimeStampFromDate } from "@/lib/utils";
import { Item } from "@radix-ui/react-select";
import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
} from "date-fns";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { MonthChangeEventHandler } from "react-day-picker";
import toast from "react-hot-toast";

export default function BlockMultipleSchedulesCalender() {
  const [date, setDate] = useState<{
    from: string;
    to: string;
  }>({
    from: RemoveTimeStampFromDate(new Date(Date.now())),
    to: RemoveTimeStampFromDate(addDays(new Date(Date.now()), 10)),
  });

  const [visibleMonths, setVisibleMonths] = useState<{
    startMonth: string;
    endMonth: string;
  }>({
    startMonth: RemoveTimeStampFromDate(startOfMonth(new Date(Date.now()))),
    endMonth: RemoveTimeStampFromDate(
      endOfMonth(addMonths(new Date(Date.now()), 1)),
    ),
  });

  // trpc Infinite query logic
  const { fetch, refetch } =
    trpc.useUtils().admin.schedule.getBlockedSchedulesByDateRangeQuery;

  const { data: blockedScheduleDays, isLoading } =
    trpc.admin.schedule.getBlockedSchedulesByDateRangeQuery.useQuery({
      fromDate: visibleMonths.startMonth,
      toDate: visibleMonths.endMonth,
    });

  // Month change handler
  async function handleMonthChange(month: Date) {
    setVisibleMonths({
      startMonth: RemoveTimeStampFromDate(month),
      endMonth: RemoveTimeStampFromDate(endOfMonth(addMonths(month, 1))),
    });

    fetch({
      fromDate: visibleMonths.startMonth,
      toDate: visibleMonths.endMonth,
    });
  }

  // trpc Mutation
  const { mutate } = trpc.admin.schedule.blockScheduleByDateRange.useMutation({
    onMutate() {
      toast.loading("Blocking...");
    },
    onSuccess() {
      refetch({
        fromDate: visibleMonths.startMonth,
        toDate: visibleMonths.endMonth,
      });
      toast.dismiss();
      toast.success("Successfully blocked schedules!");
    },
    onError(error) {
      toast.dismiss();
      toast.error(error.message);
    },
  });

  // Mutation handler
  function handleMutation() {
    mutate({ fromDate: date.from, toDate: date.to });
  }
  return (
    <div className="space-y-5 ">
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={new Date(date?.from)}
        selected={{
          from: new Date(date.from),
          to: new Date(date.to),
        }}
        className=" bg-sidebar rounded-md"
        classNames={{
          button: "hover:bg-sidebar-primary hover:text-muted",
          day_selected: "bg-sidebar-primary text-muted dark:text0-white",
        }}
        onSelect={(selectedDate) => {
          setDate((prev) => {
            let to =
              selectedDate?.to &&
              prev.to === RemoveTimeStampFromDate(selectedDate?.to)
                ? prev.to
                : selectedDate?.to
                  ? RemoveTimeStampFromDate(selectedDate?.to)
                  : prev.to;

            let from =
              selectedDate?.from &&
              prev.from === RemoveTimeStampFromDate(selectedDate?.from)
                ? prev.from
                : selectedDate?.from
                  ? RemoveTimeStampFromDate(selectedDate?.from)
                  : prev.from;

            return {
              to,
              from,
            };
          });
        }}
        numberOfMonths={2}
        onMonthChange={handleMonthChange}
        components={{
          DayContent(props) {
            const isBlocked = blockedScheduleDays?.days.some((day) =>
              isSameDay(RemoveTimeStampFromDate(props.date), new Date(day)),
            );

            return (
              <span
                className={cn("relative", {
                  "text-red-600 line-through": isBlocked,
                })}
              >
                {isLoading ? (
                  <Loader2 className="absolute left-0 top-0 animate-spin w-full h-full" />
                ) : null}
                {props.date.getDate()}
              </span>
            );
          },
        }}
      />
      <Button className="w-full" onClick={handleMutation}>
        Block Dates
      </Button>
    </div>
  );
}
