"use client";
import { trpc } from "@/app/_trpc/client";
import { toast } from "react-hot-toast";
import { Calendar } from "@/components/ui/calendar";
import { TScheduleOrganizedData } from "@/db/data/dto/schedule";
import { cn, convertUTCToLocalDate, getPrevTimeStamp } from "@/lib/utils";
import {
  ScheduleSchema,
  TScheduleSchema,
} from "@/lib/validators/ScheduleValidtor";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomDayContentWithScheduleIndicator } from "./CustomScheduleDateContent";
import { TScheduleDayReplaceString } from "@/Types/type";
import { organizedData, TOrganizedData } from "@/lib/helpers/organizedData";
import { TgetPackageScheduleDatas } from "@/db/data/dto/package";
import ScheduleSelector from "./ScheduleSelector";
import ScheduleSelectorLoader from "./ScheduleSelectorLoader";
export default function DateSelector({
  data,
  packages,
}: {
  packages: Exclude<TgetPackageScheduleDatas, null>;
  data: TScheduleOrganizedData;
}) {
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);

  const [organizedScheduleData, setOrganizedScheduleData] =
    useState<TOrganizedData | null>(null);
  const [scheduleData, setScheduleData] = useState<
    TScheduleDayReplaceString[] | null
  >();

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

  const { fetch } = trpc.useUtils().admin.getSchedule;

  watch("ScheduleDate");
  return (
    <div className="flex items-center w-full flex-col justify-center">
      <Calendar
        components={{
          DayContent: (props) =>
            CustomDayContentWithScheduleIndicator(props, data),
        }}
        mode="single"
        {...register}
        selected={new Date(getValues("ScheduleDate"))}
        onSelect={async (selectedDate) => {
          try {
            setIsLoadingQuery(true);
            if (selectedDate) {
              setValue("ScheduleDate", selectedDate.getTime(), {
                shouldValidate: true,
                shouldDirty: true,
              });

              const data = await fetch({
                ScheduleDate: convertUTCToLocalDate(
                  new Date(selectedDate.getTime())
                ),
              });
              const organizeScheduleData = organizedData({ data });
              setOrganizedScheduleData(organizeScheduleData);
              setScheduleData(data);
            }
          } catch (error) {
            toast.error("Something went wrong while loading..");
          } finally {
            setIsLoadingQuery(false);
          }
          return;
        }}
        disabled={(date) => {
          let currDate = getPrevTimeStamp(Date.now());
          return date < new Date(currDate);
        }}
      />
      <div className="w-full bottom-0 items-center justify-center my-4 flex gap-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-1 h-1 bg-cyan-400  rounded-full" />
          <p className="text-xs text-muted-foreground">Breakfast</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-1 h-1 bg-lime-500  rounded-full" />
          <p className="text-xs text-muted-foreground">Lunch</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-1 h-1 bg-orange-600  rounded-full" />
          <p className="text-xs text-muted-foreground">Dinner / Sunset</p>
        </div>
      </div>
      {!isLoadingQuery ? (
        <ScheduleSelector
          selectedDate={getValues("ScheduleDate")}
          organizedScheduleData={organizedScheduleData}
          packages={packages}
        />
      ) : (
        <ScheduleSelectorLoader />
      )}
    </div>
  );
}

/**
 *
 * React Query
 * TRPC
 * Zod
 * Schema Validation
 * Git
 * Client Side / SSR
 * Project Structure.
 * Database Query
 * DTO -> Clean Architecture.
 * Security in Next.js
 * Next-Auth -> For admin Login:
 *  - 2hr -> 8hr / 20 - 30 hr
 *  - forgot-password
 *  - change password
 *  - email verification
 *  - Automatic linking
 *  - session management
 *
 *
 *
 */
