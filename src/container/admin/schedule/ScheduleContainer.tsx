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
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { trpc } from "@/app/_trpc/client";

export default function ScheduleBar() {
  const { invalidate } = trpc.useUtils();
  const { mutate: deleteSchedules } =
    trpc.admin.schedule.clearSchedule.useMutation({
      onSuccess(data, variables, context) {
        invalidate();
        toast.success("Cleared Database");
      },
      onError(error, variables, context) {
        toast.error("Something went wrong");
      },
    });
  return (
    <div className="w-full py-12 ">
      <Card className="">
        <CardHeader className="">
          <CardTitle>Schedule&apos;s</CardTitle>
          <CardDescription>Update or add new schedules</CardDescription>
        </CardHeader>
        <CardContent className="w-full  ">
          <ScheduleDatePicker />
          <ScheduleButtonInfo />
          <ScheduleSelectors />
          <Button
            className="w-full"
            onClick={() => {
              deleteSchedules();
            }}
          >
            delete all Schedule and booking
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
