"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import {
  useClientDispatch,
  useClientSelector,
} from "@/hooks/clientStore/clientReducers";
import {
  cn,
  parseDateFormatYYYMMDDToNumber,
  RemoveTimeStampFromDate,
} from "@/lib/utils";
import { setDate } from "@/lib/features/client/packageClientSlice";
import { TSplitedFormatedDate } from "@/Types/type";
import ChooseDateCard from "./choose-date-card";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
let date = "2025-02-01";
export function ChooseDates({ className }: { className?: string }) {
  const date = useClientSelector((state) => state.package.date);

  const currentDate = new Date();

  let defaultDate: TSplitedFormatedDate = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() - 1,
    day: currentDate.getDate(),
  };

  const pickedDate: TSplitedFormatedDate =
    parseDateFormatYYYMMDDToNumber(
      date ?? RemoveTimeStampFromDate(new Date()),
    ) ?? defaultDate;

  const dispatch = useClientDispatch();
  const now = new Date(
    pickedDate?.year,
    pickedDate.month,
    currentDate.getDate(),
  );

  const [month, setMonth] = useState(now.getMonth() - 1);
  const [year, setYear] = useState(now.getFullYear());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const isDisabled = (monthIndex: number, currentYear: number) => {
    const currentDate = new Date();

    const selectedDate = new Date(currentYear, monthIndex + 1, 1);

    const sixMonthsFromNow = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 7,
    );

    return selectedDate <= currentDate || selectedDate >= sixMonthsFromNow;
  };

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 1);
    if (!isDisabled(newDate.getMonth(), newDate.getFullYear())) {
      setMonth(newDate.getMonth());
      setYear(newDate.getFullYear());
      let NewDateConverted = RemoveTimeStampFromDate(newDate);
      dispatch(setDate(NewDateConverted));
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    if (!isDisabled(newDate.getMonth(), newDate.getFullYear())) {
      setMonth(newDate.getMonth());
      setYear(newDate.getFullYear());
      let NewDateConverted = RemoveTimeStampFromDate(newDate);
      dispatch(setDate(NewDateConverted));
    }
  };

  const handleMonthClick = (month: number) => {
    const newDate = new Date(year, month, 1);
    if (!isDisabled(newDate.getMonth(), newDate.getFullYear())) {
      setMonth(month);
      let NewDateConverted = RemoveTimeStampFromDate(newDate);
      dispatch(setDate(NewDateConverted));
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "w-full relative py-2 md:py-2.5 border-muted-foreground items-start justify-center",
          className,
        )}
      >
        <div className="">
          <h4 className="text-left text-sm hidden md:block font-bold">Date</h4>
          <div className="md:text-sm text-muted-foreground font-semibold">
            {date ? <p>{format(date, "dd/MM/yyyy")}</p> : <p>Choose a Date</p>}
          </div>
        </div>
        {/* <div className="absolute h-10 w-[1px] top-auto bottom-auto right-0 bg-muted-foreground" /> */}
      </PopoverTrigger>
      <PopoverContent
        alignOffset={-25}
        className="w-auto border-primary overflow-hidden p-0 bg-white"
        align="start"
      >
        <ChooseDateCard />
      </PopoverContent>
    </Popover>
  );
}
