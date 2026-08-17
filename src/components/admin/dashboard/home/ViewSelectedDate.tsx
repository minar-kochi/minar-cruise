"use client";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import { formatDayKey } from "@/lib/datetime";
import React from "react";

export default function ViewSelectedDate() {
  const date = useAppSelector((state) => state.schedule.date);
  return (
    <div>
      <p>{formatDayKey(date, "dateLongWeekday")}</p>
    </div>
  );
}
