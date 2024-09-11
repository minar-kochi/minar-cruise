"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, StyledElement } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  sizeMode?: "lg" | "sm";
};

const CalendarVarients = ({
  classNames,
  props,
}: {
  classNames?: Partial<StyledElement<string>>;
  props: CalendarProps;
}) => ({
  lg: {
    months: "flex flex-col sm:flex-row space-y-4  sm:space-x-4 sm:space-y-0",
    month: "space-y-2 ",
    caption: "flex justify-center pt-1 relative  items-center",
    caption_label: "text-sm font-medium",
    nav: "space-x-1 flex items-center",
    nav_button: cn(
      buttonVariants({ variant: "outline" }),
      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
    ),
    nav_button_previous: "absolute left-1",
    nav_button_next: "absolute right-1",
    table: "w-full border-collapse space-y-1 ",
    head_row: "flex",
    head_cell: "text-muted-foreground rounded-md w-10 sm:w-11 font-normal text-[1rem]",
    row: "flex w-full my-2  ",
    cell: "h-9 w-9  sm:h-7 sm:w-10 rounded-md text-center text-sm p-0 mx-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
    day: cn(
      buttonVariants({ variant: "ghost" }),
      "w-10 h-8 sm:h-8 sm:w-10 p-0 font-normal  aria-selected:opacity-100",
    ),
    day_range_end: "day-range-end",
    day_selected:
      "bg-secondary relative z-10 text-secondary-foreground hover:bg-secondary hover:text-primary-foreground focus:bg-secondary focus:text-secondary-foreground",
    day_today: "",
    day_outside:
      "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
      day_disabled:  " text-black",
      day_range_middle:
      "aria-selected:bg-accent aria-selected:text-accent-foreground",
    day_hidden: "invisible",
  },
  sm: {
    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
    month: "space-y-4",
    caption: "flex justify-center pt-1 relative items-center",
    caption_label: "text-sm font-medium",
    nav: "space-x-1 flex items-center",
    nav_button: cn(
      buttonVariants({ variant: "outline" }),
      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
    ),
    nav_button_previous: "absolute left-1",
    nav_button_next: "absolute right-1",
    table: "w-full border-collapse space-y-1",
    head_row: "flex",
    head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
    row: "flex w-full mt-2",
    cell: cn(
      "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
      props.mode === "range"
        ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
        : "[&:has([aria-selected])]:rounded-md",
    ),
    day: cn(
      buttonVariants({ variant: "ghost" }),
      "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
    ),
    day_range_start: "day-range-start",
    day_range_end: "day-range-end",
    day_selected:
      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
    day_today: "bg-accent text-accent-foreground",
    day_outside:
      "day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
    day_disabled: "text-muted-foreground opacity-50",
    day_range_middle:
      "aria-selected:bg-accent aria-selected:text-accent-foreground",
    day_hidden: "invisible",
    ...classNames,
  },
});

function Calendar({
  className,
  classNames,
  sizeMode = "sm",
  showOutsideDays = false,

  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={
        CalendarVarients({
          classNames,
          props,
        })[sizeMode]
      }
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
