"use client";
import { trpc } from "@/app/_trpc/client";
import ClientCalenderScheduleDay from "@/components/calender/ClientCalenderScheduleDay";
import { Calendar } from "@/components/ui/calendar";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  cn,
  filterDateFromCalender,
  RemoveTimeStampFromDate,
} from "@/lib/utils";
import { $Enums } from "@prisma/client";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import CalendarPopover from "./CalendarPopover";
type TBookingFormCalender = {
  setFormDateValue: (value: string) => void;
  setScheduleId: (value: string | undefined) => void;
  packageId: string;
  packageCategory: $Enums.PACKAGE_CATEGORY;
  popoverCalender?: true | false;
  className?: string;
};
export default function BookingFormCalender({
  setFormDateValue,
  setScheduleId,
  packageId,
  packageCategory,
  popoverCalender,
  className,
}: TBookingFormCalender) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<string>(
    RemoveTimeStampFromDate(new Date(Date.now())),
  );
  const { refetch, isFetching, data, isPending } =
    trpc.user.getSchedulesByPackageIdAndDate.useQuery({
      packageId: packageId,
      date: month,
    });

  const availableDateArray = data?.schedules.map((item) => {
    return item.day;
  });

  const disabledDays = data?.blockedScheduleDateArray.map((item) => ({
    day: new Date(item.day),
  }));
  return popoverCalender ? (
    <CalendarPopover date={date}>
      <div
        className={cn(
          "rounded-md overflow-hidden shadow-xl   bg-primary-foreground   relative",
          className,
        )}
      >
        <Calendar
          className=""
          sizeMode={"lg"}
          disabled={(date) =>
            filterDateFromCalender({ date, dateArray: disabledDays })
          }
          mode="single"
          components={{
            DayContent: (props) =>
              ClientCalenderScheduleDay({
                AvailableDate: availableDateArray,
                props,
                packageCategory,
              }),
          }}
          selected={date}
          onSelect={(date, dat, mod, e) => {
            if (mod.disabled) return;

            if (!date) return;
            setDate(date);
            setFormDateValue(RemoveTimeStampFromDate(date));
            if (!data || !data.schedules) return;

            let scheduleIndex = data?.schedules.findIndex(
              (fv) =>
                RemoveTimeStampFromDate(new Date(fv.day)) ===
                RemoveTimeStampFromDate(date),
            );

            let schedule =
              scheduleIndex !== -1 ? data.schedules[scheduleIndex] : null;
            if (!schedule) {
              setScheduleId(undefined);
              return;
            }
            setScheduleId(schedule.id);
          }}
          onMonthChange={(month) => {
            setMonth(RemoveTimeStampFromDate(month));
          }}
        />
        <div
          className={cn(
            "absolute top-16 w-full h-full bg-gray-200/70 z-20 animate-pulse",
            {
              hidden: !isPending,
            },
          )}
        >
          <div className="flex items-center justify-center my-auto w-full h-full relative -top-12">
            <div className="flex items-center justify-center gap-2 p-2 bg-white rounded-md">
              <Loader2 className="animate-spin" />
              <p>Loading Schedules...</p>
            </div>
          </div>
        </div>
      </div>
    </CalendarPopover>
  ) : (
    <div className="  py-4 rounded-md overflow-hidden shadow-xl    bg-primary-foreground  border-black relative">
      <Calendar
        className="p-0 py-3 px-2 "
        sizeMode={"lg"}
        disabled={(date) =>
          filterDateFromCalender({ date, dateArray: disabledDays })
        }
        mode="single"
        components={{
          DayContent: (props) =>
            ClientCalenderScheduleDay({
              AvailableDate: availableDateArray,
              props,
              packageCategory,
            }),
        }}
        selected={date}
        onSelect={(date, dat, mod, e) => {
          if (mod.disabled) return;

          if (!date) return;
          setDate(date);
          setFormDateValue(RemoveTimeStampFromDate(date));
          if (!data || !data.schedules) return;

          let scheduleIndex = data?.schedules.findIndex(
            (fv) =>
              RemoveTimeStampFromDate(new Date(fv.day)) ===
              RemoveTimeStampFromDate(date),
          );

          let schedule =
            scheduleIndex !== -1 ? data.schedules[scheduleIndex] : null;
          if (!schedule) {
            setScheduleId(undefined);
            return;
          }
          setScheduleId(schedule.id);
        }}
        onMonthChange={(month) => {
          setMonth(RemoveTimeStampFromDate(month));
        }}
      />
      <div
        className={cn(
          "absolute top-16 w-full h-full bg-gray-200/70 z-20 animate-pulse",
          {
            hidden: !isPending,
          },
        )}
      >
        <div className="flex items-center justify-center my-auto w-full h-full relative -top-12">
          <div className="flex items-center justify-center gap-2 p-2 bg-white rounded-md">
            <Loader2 className="animate-spin" />
            <p>Loading Schedules...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
