"use client";
import Bounded from "@/components/elements/Bounded";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ScheduleDatePicker from "@/components/admin/dashboard/Schedule/ScheduleDatePicker";
import ScheduleSelectors from "@/components/admin/dashboard/Schedule/ScheduleSelectors";
import ScheduleButtonInfo from "@/components/admin/dashboard/Schedule/ScheduleButtonInfo";
import { Button, buttonVariants } from "@/components/ui/button";
import toast from "react-hot-toast";
import { trpc } from "@/app/_trpc/client";
import Link from "next/link";

export default function ScheduleBar() {
  return (
    <div className="w-full py-12 ">
      <Card className="">
        <CardHeader className="">
          <CardTitle>Manage Schedule&apos;s</CardTitle>
          <CardDescription>
            Quickly add or update time and date schedules
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full  ">
          <div className="flex justify-between mt-2 ">
            <div className="max-w-sm group-[.schedule-sheet]:w-full group-[.schedule-sheet]:max-w-full">
              <p className="font-medium text-sm">Pick a date</p>
              <ScheduleDatePicker />
              <ScheduleButtonInfo />
            </div>
            <div>
              <Link
                href={"/admin/schedule#schedule-table"}
                className={buttonVariants({
                  variant: "default",
                  className: "group-[.schedule-sheet]:hidden",
                })}
              >
                Go to Schedules
              </Link>
            </div>
          </div>
          <div className=" mx-auto left-0 right-0">
            <ScheduleSelectors />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
