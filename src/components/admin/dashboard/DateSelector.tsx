"use client";
import {
  Card,
  CardContent,
  CardDescription,
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
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CustomDayContentWithScheduleIndicator } from "./_Schedule/CustomScheduleDateContent";
import ScheduleSelectorLoader from "./ScheduleSelectorLoader";
import Bounded from "@/components/elements/Bounded";
import { PopOverDatePicker } from "./PopOverScheduleDate";
import { Check, RefreshCw } from "lucide-react";
import ScheduleSelectContainer from "./ScheduleSelectContainer";
import { useScheduleStore } from "@/providers/admin/schedule-store-provider";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
// import { increment } from "@/lib/features/schedule/ScheduleSlice";

export default function DateSelector() {
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);
  const [isPopoverOpened, setIsPopoverOpened] = useState(false);

  const {
    setOrganizedData,
    organizedSchedule,
    setDate,
    selectedSchedulePackageId,
    date,
  } = useScheduleStore((state) => state);

  const { data } = trpc.admin.getSchedulesByDateOrNow.useQuery({
    ScheduleDate: date,
  });

  const { getData } = trpc.useUtils().admin.getSchedulesByDateOrNow;

  useEffect(() => {
    const sdata = getData({
      ScheduleDate: date,
    });

    if (!sdata) return;

    setOrganizedData(sdata);
  }, [data]);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TScheduleSchema>({
    resolver: zodResolver(ScheduleSchema),
  });

  return (
    <Bounded className="">
      <div className="max-w-sm w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Schedule&apos;s</CardTitle>
            <CardDescription>Update or add new schedules</CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            {/* <PopOverDatePicker
              isPopoverOpened={isPopoverOpened}
              setIsPopoverOpened={setIsPopoverOpened}
              date={date}
              calenderProps={{
                components: {
                  DayContent: (props) =>
                    CustomDayContentWithScheduleIndicator(props),
                },
                sizeMode: "lg",
                mode: "single",
                selected: new Date(date),
                onSelect: async (selectedDate) => {
                  if (!selectedDate) {
                    return;
                  }
                  setIsPopoverOpened(false);

                  let DateStringFormated =
                    RemoveTimeStampFromDate(selectedDate);

                  try {
                    setIsLoadingQuery(true);
                    if (selectedDate) {
                      setValue("ScheduleDate", selectedDate.toString(), {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setDate(DateStringFormated);
                    }
                  } catch (error) {
                    console.log(error);
                    toast.error("Something went wrong while loading..");
                  } finally {
                    setIsLoadingQuery(false);
                  }
                },
                disabled: (date) => {
                  let currDate = getPrevTimeStamp(Date.now());
                  return date < new Date(currDate);
                },
              }}
            /> */}
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
              <ScheduleSelectContainer />
            ) : (
              <ScheduleSelectorLoader />
            )}
            <Button
              className="font-medium mt-2"
              onClick={() => {
                toast(JSON.stringify(selectedSchedulePackageId));
              }}
            >
              show schedules.
            </Button>
          </CardContent>
        </Card>
      </div>
    </Bounded>
  );
}
