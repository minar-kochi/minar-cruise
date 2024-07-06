"use client"

import React from "react";
import { Calendar } from "@/components/ui/calendar";

const SetCalender = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="pl-0"
      />
    </>
  );
};

export default SetCalender;
