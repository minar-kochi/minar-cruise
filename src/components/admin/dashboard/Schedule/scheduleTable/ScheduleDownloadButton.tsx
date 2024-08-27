"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, RemoveTimeStampFromDate } from "@/lib/utils";
import React from "react";
import { addDays, format } from "date-fns";
import { trpc } from "@/app/_trpc/client";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface IScheduleDownloadButton {
  className?: string;
}

type TDateRange = {
  from: string;
  to: string;
};
export default function ScheduleDownloadButton({
  className,
}: IScheduleDownloadButton) {
  const [date, setDate] = React.useState<TDateRange>({
    from: RemoveTimeStampFromDate(new Date(Date.now())),
    to: RemoveTimeStampFromDate(addDays(new Date(Date.now()), 30)),
  });

  const { fetch } = trpc.useUtils().admin.schedule.getSchedulesByDateRange;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Download</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Download Schedule</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="">
              Select Date
            </Label>
            {/* <PopOverDateRangePicker className=""/> */}
            <div className={cn("grid gap-2", className)}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    numberOfMonths={2}
                    // selected={date.from}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
              /> */}
          </div>
          <div className="grid grid-cols-3 ">
            <div className="flex gap-3">
              <Checkbox />
              <Label>count</Label>
            </div>
            <div className="flex gap-3">
              <Checkbox />
              <Label>date</Label>
            </div>
            <div className="flex gap-3">
              <Checkbox />
              <Label>day</Label>
            </div>
          </div>
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="">
              To date
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div> */}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className=""
            onClick={() => {
              // fetch({fromDate: date.from, toDate: date.to})
            }}
          >
            Download schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
