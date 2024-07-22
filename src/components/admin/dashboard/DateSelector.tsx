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
import { Calendar } from "@/components/ui/calendar";
import { TScheduleOrganizedData } from "@/db/data/dto/schedule";
import {
  cn,
  convertLocalDateToUTC,
  getPrevTimeStamp,
  RemoveTimeStampFromDate,
} from "@/lib/utils";
import {
  ScheduleSchema,
  TScheduleSchema,
} from "@/lib/validators/ScheduleValidtor";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomDayContentWithScheduleIndicator } from "./CustomScheduleDateContent";
import { TScheduleDayReplaceString } from "@/Types/type";
// import { organizedData, TOrganizedData } from "@/lib/helpers/organizedData";
import { TgetPackageScheduleDatas } from "@/db/data/dto/package";
import ScheduleSelector from "./ScheduleSelector";
import ScheduleSelectorLoader from "./ScheduleSelectorLoader";
import Bounded from "@/components/elements/Bounded";
import { PopOverDatePicker } from "./PopOverScheduleDate";
import { Check, RefreshCw } from "lucide-react";

import ScheduleSelector2 from "./ScheduleSelector2";
import { formatISO } from "date-fns";
import { TOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { organizeScheduleData } from "@/lib/helpers/organizedData";
import ScheduleSelectContainer from "./ScheduleSelectContainer";
import { useScheduleStore } from "@/providers/admin/schedule-store-provider";
// import { useScheduleStore, useScheduleStore } from "@/providers/admin/schedule-store-provider";
export default function DateSelector() {
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);
  const ScheduleData = useScheduleStore((state) => state.schedules);
  const [organizedScheduleData, setOrganizedScheduleData] =
    useState<TOrganizedScheduleData | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TScheduleSchema>({
    resolver: zodResolver(ScheduleSchema),
  });

  const { fetch } = trpc.useUtils().admin.getSchedulesByDateOrNow;

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
              calenderProps={{
                components: {
                  DayContent: (props) =>
                    CustomDayContentWithScheduleIndicator(props, ScheduleData),
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

                      const data = await fetch({
                        ScheduleDate: DateStringFormated,
                      });

                      if (!data) return;

                      const OrgData = organizeScheduleData({ data });

                      setOrganizedScheduleData(OrgData);
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
                <ScheduleSelectContainer
                  organizedScheduleData={organizedScheduleData}
                />{" "}
              </>
            ) : (
              <ScheduleSelectorLoader />
            )}
          </CardContent>
        </Card>
      </div>
    </Bounded>
  );
}
