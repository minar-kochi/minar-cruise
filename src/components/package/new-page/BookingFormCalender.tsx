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
import { Info, Loader2 } from "lucide-react";
import React, { useState } from "react";
import CalendarPopover from "./CalendarPopover";
import toast from "react-hot-toast";
import { useClientSelector } from "@/hooks/clientStore/clientReducers";
import { getPackageById } from "@/lib/features/client/packageClientSelectors";
import { useAppDispatch } from "@/hooks/adminStore/reducer";
import { setDate } from "@/lib/features/client/packageClientSlice";
import { MIN_NEW_BOOKING_COUNT } from "@/constants/config/business";
import BookingCloseIn from "./booking-close-in";
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
  const packageData = useClientSelector((state) =>
    getPackageById(state, packageId),
  );

  // const [date, setDate] = useState<Date | undefined>(undefined);
  const date = useClientSelector((state) => state.package.date);
  const dispatch = useAppDispatch();
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
  if (!packageData) return;
  console.log("hello", disabledDays);
  return (
    <>
      <BookingCloseIn
        availableDates={availableDateArray}
        disabled={disabledDays}
        packageId={packageId}
      />
      {popoverCalender ? (
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
              classNames={{
                button: "[&>button]:aria-selected:bg-black",
              }}
              components={{
                DayContent: (props) =>
                  ClientCalenderScheduleDay({
                    AvailableDate: availableDateArray,
                    props,
                    packageCategory,
                    blockedDate: data?.blockedScheduleDateArray.map(
                      (item) => item.day,
                    ),
                    startFrom: packageData.fromTime,
                    isLoading: isPending,
                  }),
              }}
              selected={new Date(date ?? Date.now())}
              onSelect={(date, dat, mod, e) => {
                if (mod.disabled) {
                  toast.error("This date is disabled");
                  return;
                }

                if (!date) return;
                dispatch(setDate(RemoveTimeStampFromDate(date)));
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
                  if (packageCategory !== "SUNSET") {
                    toast(
                      `This date requires at least ${MIN_NEW_BOOKING_COUNT} guests to set sail! 🌊✨`,
                      {
                        className:
                          "rounded-full bg-blue-50 border h-20 text-xl border-blue-300 text-blue-900 shadow-md",
                        duration: 5000,
                        icon: <Info className="text-blue-600" />,
                        position: "top-center",
                        ariaProps: { "aria-live": "polite", role: "alert" },
                        // removeDelay: 300,
                      },
                    );
                  }
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
            className="p-0 py-3 px-2  "
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
                  blockedDate: data?.blockedScheduleDateArray.map(
                    (item) => item.day,
                  ),
                  startFrom: packageData?.fromTime,
                  isLoading: isPending,
                }),
            }}
            selected={new Date(date ?? Date.now())}
            onSelect={(date, dat, mod, e) => {
              if (mod.disabled) {
                toast.error("This date is disabled");
                return;
              }

              if (!date) return;
              dispatch(setDate(RemoveTimeStampFromDate(date)));
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
                if (packageCategory !== "SUNSET") {
                  toast(
                    `This date requires at least ${MIN_NEW_BOOKING_COUNT} guests to set sail! 🌊✨`,
                    {
                      className:
                        "rounded-full bg-blue-50 border h-20 text-xl border-blue-300 text-blue-900 shadow-md",
                      duration: 5000,
                      icon: <Info className="text-blue-600" />,
                      position: "top-center",
                      ariaProps: { "aria-live": "polite", role: "alert" },
                      // removeDelay: 300,
                    },
                  );
                }

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
      )}
      <div className="my-2">
        <p className="text-xs pb-2 font-semibold text-center">
          All Date are in IST
          <br />
          <span>(Indian Standard Time)</span>
        </p>
      </div>
    </>
  );
}
