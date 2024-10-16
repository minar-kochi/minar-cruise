"use client";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import { format } from "date-fns";
import React from "react";

export default function ViewSelectedDate() {
  const date = useAppSelector((state) => state.schedule.date);
  return (
    <div>
      <p>{format(date, "iii/dd MMM")}</p>
    </div>
  );
}
