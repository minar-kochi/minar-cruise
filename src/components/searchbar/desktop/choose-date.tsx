import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import {
  useClientDispatch,
  useClientSelector,
} from "@/hooks/clientStore/clientReducers";
import {
  parseDateFormatYYYMMDDToNumber,
  RemoveTimeStampFromDate,
} from "@/lib/utils";
import { setDate } from "@/lib/features/client/packageClientSlice";
import { TSplitedFormatedDate } from "@/Types/type";
let date = "2025-02-01";
export function ChooseDates() {
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

  const [month, setMonth] = useState(now.getMonth());
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
      <PopoverTrigger className="w-full ml-4 py-2 md:py-3 border-muted-foreground hidden md:flex items-start flex-col gap-0">
        <h4 className="text-sm hidden md:block font-semibold">When</h4>
        <p className="md:text-sm text-muted-foreground">Choose a Date</p>
      </PopoverTrigger>
      <PopoverContent
        alignOffset={-25}
        className="w-auto border-primary overflow-hidden p-0 bg-white"
        align="start"
      >
        <div className="relative">
          <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDisabled(month - 1, year)}
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 px-4 py-2 text-center">
              <span className="font-medium">{months[month]}</span>
              <span className="ml-2 text-gray-500">{year}</span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDisabled(month + 1, year)}
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1 p-2">
            {months.map((monthName, index) => (
              <button
                key={monthName}
                onClick={() =>
                  !isDisabled(index, year) && handleMonthClick(index)
                }
                className={`
                  p-2 text-sm rounded-md transition-colors
                  ${month === index ? "bg-primary/20" : "hover:bg-gray-100"}
                  ${isDisabled(index, year) ? "opacity-50 cursor-not-allowed" : ""}
                `}
                disabled={isDisabled(index, year)}
                role="option"
                aria-selected={month === index}
              >
                {monthName}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
