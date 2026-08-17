"use client";

import { calendarDateToDayKey, formatDayKey } from "@/lib/datetime";
import { CalculatorIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function BookingFormDatePicker() {
  const [date, setDate] = useState<Date>();

  return (
    <div className="">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"destructive"}
            className="bg-muted hover:bg-black hover:text-white text-black justify-start gap-3 w-full "
          >
            <CalculatorIcon size={20} />
            {date ? formatDayKey(calendarDateToDayKey(new Date(date)), "dateOrdinal") : <p>Select a date</p>}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={{
              before: new Date(Date.now()),
            }}
            components={
              {
                // Day: (props) => ClientCalenderScheduleDay(props)  ,
              }
            }
            classNames={{}}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
