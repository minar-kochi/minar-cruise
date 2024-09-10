"use client";

import * as React from "react";
// import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarRange } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import { useDispatch } from "react-redux";
import { setPopOverDateToggle } from "@/lib/features/schedule/ScheduleSlice";

export function PopOverDatePicker({
  calenderProps,
  date,
}: {
  calenderProps: CalendarProps;
  date?: string;
}) {
  const { isPopOverDateOpened } = useAppSelector((state) => state.schedule);
  const dispatch = useAppDispatch();
  return (
    <Popover
      // open={isPopOverDateOpened}
      // onOpenChange={(open) => {
      //   dispatch(setPopOverDateToggle(open));
      // }}
    >
      <PopoverTrigger
        // onClick={() => dispatch(setPopOverDateToggle(true))}
        asChild
      >
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
          <CalendarRange className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar {...calenderProps} />
        <div className="bottom-0 my-4 flex w-full items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-1 rounded-full bg-cyan-400" />
            <p className="text-xs text-muted-foreground">Breakfast</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-1 rounded-full bg-lime-500" />
            <p className="text-xs text-muted-foreground">Lunch</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-1 rounded-full bg-orange-600" />
            <p className="text-xs text-muted-foreground"> Sunset</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-1 rounded-full bg-violet-600" />
            <p className="text-xs text-muted-foreground">Dinner</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
