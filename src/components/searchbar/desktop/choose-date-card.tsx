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

export default function ChooseDateCard() {
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
            onClick={() => !isDisabled(index, year) && handleMonthClick(index)}
            className={cn("p-2 text-sm rounded-md transition-colors ", {
              "bg-primary/20": month === index,
              "hover:bg-gray-100": month !== index,
              "opacity-50 cursor-not-allowed": isDisabled(index, year),
            })}
            disabled={isDisabled(index, year)}
            role="option"
            aria-selected={month === index}
          >
            {monthName}
          </button>
        ))}
      </div>
    </div>
  );
}
