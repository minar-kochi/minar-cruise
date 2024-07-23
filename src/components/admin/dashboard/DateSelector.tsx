"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { trpc } from "@/app/_trpc/client";
import { toast } from "react-hot-toast";
import { getPrevTimeStamp, RemoveTimeStampFromDate } from "@/lib/utils";
import {
  ScheduleSchema,
  TScheduleSchema,
} from "@/lib/validators/ScheduleValidtor";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomDayContentWithScheduleIndicator } from "./CustomScheduleDateContent";
import ScheduleSelectorLoader from "./ScheduleSelectorLoader";
import Bounded from "@/components/elements/Bounded";
import { PopOverDatePicker } from "./PopOverScheduleDate";
import { Check, RefreshCw } from "lucide-react";

import { TOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { organizeScheduleData } from "@/lib/helpers/organizedData";
import ScheduleSelectContainer from "./ScheduleSelectContainer";
import { useScheduleStore } from "@/providers/admin/schedule-store-provider";

export default function DateSelector() {
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);

  const { setOrganizedData,setDate, selectedSchedulePackageId,date } = useScheduleStore(
    (state) => state
  );

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TScheduleSchema>({
    resolver: zodResolver(ScheduleSchema),
  });

  const { fetch, cancel, invalidate } =
    trpc.useUtils().admin.getSchedulesByDateOrNow;

  watch("ScheduleDate");
  return (
    <Bounded className="">
      <div className="max-w-sm w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Schedule&apos;s</CardTitle>
            <CardDescription>Update or add new schedules</CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <PopOverDatePicker
              date={date}
              calenderProps={{
                components: {
                  DayContent: (props) =>
                    CustomDayContentWithScheduleIndicator(props),
                },
                sizeMode: "lg",
                mode: "single",
                selected: new Date(watch("ScheduleDate")),
                onSelect: async (selectedDate) => {
                  if (!selectedDate) {
                    return toast(`Please select a valid Date.`);
                  }

                  let DateStringFormated =
                    RemoveTimeStampFromDate(selectedDate);

                  try {
                    setIsLoadingQuery(true);
                    if (selectedDate) {
                      setValue("ScheduleDate", selectedDate.toString(), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setDate(DateStringFormated)
                      const data = await fetch({
                        ScheduleDate: DateStringFormated,
                      });
                      if (!data) return;
                      setOrganizedData(data);
                    }
                  } catch (error) {
                    console.log(error);
                    toast.error("Something went wrong while loading..");
                  } finally {
                    setIsLoadingQuery(false);
                  }
                  return;
                },
                disabled: (date) => {
                  let currDate = getPrevTimeStamp(Date.now());
                  return date < new Date(currDate);
                },
                ...register,
              }}
            />
            <div className="flex mb-4 mt-4 gap-2 flex-wrap">
              <div className="flex items-center gap-2 ">
                <RefreshCw className="h-4  w-4" />
                <p className="text-xs text-muted-foreground">
                  Update Existing Schedule
                </p>
              </div>
              <div className="flex items-center gap-2 ">
                <Check className="h-4  w-4" />
                <p className="text-xs text-muted-foreground">
                  Create New Schedule
                </p>
              </div>
            </div>
            {!isLoadingQuery ? (
              <>
                <ScheduleSelectContainer />{" "}
              </>
            ) : (
              <ScheduleSelectorLoader />
            )}
            <button
              onClick={() => {
                toast(JSON.stringify(selectedSchedulePackageId));
              }}
            >
              show schedules.
            </button>
          </CardContent>
        </Card>
      </div>
    </Bounded>
  );
}
