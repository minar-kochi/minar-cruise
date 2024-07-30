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
import ScheduleButtonInfo from "./ScheduleButtonInfo";
import ScheduleDatePicker from "@/components/admin/dashboard/_Schedule/ScheduleDatePicker";
import ScheduleSelectContainer from "../ScheduleSelectContainer";
// import ScheduleSelectContainer from "@/components/admin/dashboard/_Schedule/ScheduleSelect";
// import ScheduleSelect from "@/container/admin/schedule/ScheduleSelect";

export default function NewDateSelector() {
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
          {/* <ScheduleSelectContainer/> */}
        </CardContent>
      </Card>
    </Bounded>
  );
}
