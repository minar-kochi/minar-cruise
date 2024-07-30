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
import ScheduleDatePicker from "@/components/admin/dashboard/_Schedule/ScheduleDatePicker";
import ScheduleSelectors from "@/components/admin/dashboard/_Schedule/ScheduleSelectors";
import ScheduleButtonInfo from "@/components/admin/dashboard/_Schedule/ScheduleButtonInfo";
import { useAppStore } from "@/hooks/adminStore/reducer";
import { TExcludedOrganizedUpcommingSchedule } from "@/Types/Schedule/ScheduleSelect";
import { setInitialOrganizedScheduleDates } from "@/lib/features/schedule/ScheduleSlice";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function ScheduleBar({
  upCommingSchedules,
}: {
  upCommingSchedules: TExcludedOrganizedUpcommingSchedule;
}) {
  const store = useAppStore();
  const initialized = useRef(false);
  if (!initialized.current) {
    // Runs on server
    store.dispatch(setInitialOrganizedScheduleDates(upCommingSchedules));
    initialized.current = true;
  }
  return (
    <Bounded className="">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Schedule&apos;s</CardTitle>
          <CardDescription>Update or add new schedules</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <ScheduleDatePicker />
          <ScheduleButtonInfo />
          <ScheduleSelectors />
          <Button
            onClick={() => {
              toast.success("Good Morning!");
            }}
          >
            Show Date
          </Button>
        </CardContent>
      </Card>
    </Bounded>
  );
}
