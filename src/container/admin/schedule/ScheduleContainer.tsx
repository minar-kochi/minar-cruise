"use client";
import Bounded from "@/components/elements/Bounded";
import React, { useRef } from "react";
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
import { useAppSelector, useAppStore } from "@/hooks/adminStore/reducer";
import { TExcludedOrganizedUpcommingSchedule } from "@/Types/Schedule/ScheduleSelect";
import {
  setCurrentScheduleDate,
  setDate,
  setInitialOrganizedScheduleDates,
} from "@/lib/features/schedule/ScheduleSlice";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Schedule } from "@prisma/client";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import { trpc } from "@/app/_trpc/client";

export default function ScheduleBar() {
  const { mutate: deleteSchedules } = trpc.admin.clearSchedule.useMutation({
    onSuccess(data, variables, context) {
      toast.success("Cleared Database");
    },
    onError(error, variables, context) {
      toast.error("SOmethign went wrong");
    },
  });
  return (
    <Bounded className="">
      <Card className="w-full   ">
        <CardHeader>
          <CardTitle>Schedule&apos;s</CardTitle>
          <CardDescription>Update or add new schedules</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <ScheduleDatePicker />
          <ScheduleButtonInfo />
          <ScheduleSelectors />
          <Button
            className="w-full"
            onClick={() => {
              // deleteSc3hedules();
            }}
          >
            delete Schedule
          </Button>
        </CardContent>
      </Card>
    </Bounded>
  );
}
