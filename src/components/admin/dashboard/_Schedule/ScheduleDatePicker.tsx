"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import {
  setCurrentScheduleDate,
  setDate,
  setPopOverDateToggle,
} from "@/lib/features/schedule/ScheduleSlice";
import { getPrevTimeStamp, RemoveTimeStampFromDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { PopOverDatePicker } from "@/components/admin/dashboard/PopOverScheduleDate";
import { CustomDayContentWithScheduleIndicator } from "@/components/admin/dashboard/CustomScheduleDateContent";
import { trpc } from "@/app/_trpc/client";

export default function ScheduleDatePicker() {
  const date = useAppSelector((state) => state.schedule.date);
  const dispatch = useAppDispatch();

  const { fetch } = trpc.useUtils().admin.getSchedulesByDateOrNow;
  return (
    <PopOverDatePicker
      date={date}
      calenderProps={{
        components: {
          DayContent: (props) => CustomDayContentWithScheduleIndicator(props),
        },
        sizeMode: "lg",
        mode: "single",
        onNextClick: (date) => {
          /**
           * @TODO [Neil/Amjad/Muad]
           *  Fetch new Schedule for this month and update it into the... upCommingSchedules
           *
           */
        },

        selected: new Date(date),
        onSelect: async (selectedDate) => {
          if (!selectedDate) {
            return;
          }
          dispatch(setPopOverDateToggle(false));
          let DateStringFormated = RemoveTimeStampFromDate(selectedDate);

          try {
            if (selectedDate) {
              dispatch(setDate(DateStringFormated));
              const data = await fetch({
                ScheduleDate: DateStringFormated,
              });
              // if (!data?.length) return;
              
              dispatch(setCurrentScheduleDate(data));
            }
          } catch (error) {
            console.log(error);
            toast.error("Something went wrong while loading..");
          } finally {
            // Remove Loading..
            dispatch(setPopOverDateToggle(false));
          }
        },
        disabled: (date) => {
          let currDate = getPrevTimeStamp(Date.now());
          return date < new Date(currDate);
        },
      }}
    />
  );
}