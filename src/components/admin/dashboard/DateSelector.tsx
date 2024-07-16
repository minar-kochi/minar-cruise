"use client";
// import { IoMdRefresh } from "react-icons/io";
import { trpc } from "@/app/_trpc/client";

import { Calendar } from "@/components/ui/calendar";
import { TScheduleOrganizedData } from "@/db/data/dto/schedule";
import { convertUTCToLocalDate, getPrevTimeStamp } from "@/lib/utils";
import {
  ScheduleSchema,
  TScheduleSchema,
} from "@/lib/validators/ScheduleValidtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomDayContentWithScheduleIndicator } from "./CustomScheduleDateContent";
import { TScheduleDayReplaceString } from "@/Types/type";
import { organizedData, TOrganizedData } from "@/lib/helpers/organizedData";
import ScheduleSelect from "./ScheduleSelect";
import { TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { Check, CheckCheckIcon, RefreshCw } from "lucide-react";
export default function DateSelector({
  data,
  packages,
}: {
  packages: Exclude<TgetPackageScheduleDatas, null>;
  data: TScheduleOrganizedData;
}) {
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

  /**@deprecated */
  async function HandleSubmit(queryData: TScheduleSchema) {
    const data = await fetch({
      ScheduleDate: queryData.ScheduleDate,
    });
    setScheduleData(data);
  }

  watch("ScheduleDate");

  /**
   * @TODO - AMJAD
   *
   * Prettify the Data fetched / create form element that is displayed when schedule data is passed
   *
   *
   *   */

  return (
    <div className="flex items-center w-full flex-col justify-center">
      <form action="" className="w-full" onSubmit={handleSubmit(HandleSubmit)}>
        <Calendar
          components={{
            DayContent: (props) =>
              CustomDayContentWithScheduleIndicator(props, data),
          }}
          className="min-w-96 min-h-96 w-full h-full border-2"
          mode="single"
          {...register}
          selected={new Date(getValues("ScheduleDate"))}
          onSelect={async (selectedDate) => {
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
            return;
          }}
          disabled={(date) => {
            let currDate = getPrevTimeStamp(Date.now());
            return date < new Date(currDate);
          }}
        />
        <button type="submit">Submit!</button>
      </form>

      {/* @TODO - AMJAD Display the form here and create the elements and default states.  */}
      <div className="flex flex-col gap-y-12 w-full items-center justify-center mt-12">
        <div className="flex gap-2 justify-between w-full max-w-sm">
          <p className="text-2xl font-medium">Break fast</p>
          <div className="flex gap-2">
            <ScheduleSelect
              key={organizedScheduleData?.breakfast?.id}
              // placeholder="Breakfast"
              selected={organizedScheduleData?.breakfast}
              packages={packages.BreakFast}
            />
            <button>
              {organizedScheduleData?.breakfast?.id ? <RefreshCw /> : <Check />}
            </button>
          </div>
        </div>
        <div className="flex gap-2 justify-between w-full max-w-sm">
          <p className="text-2xl ">Lunch </p>
          <div className="flex gap-2">
            <ScheduleSelect
              key={organizedScheduleData?.lunch?.id}
              // placeholder="Lunch"
              selected={organizedScheduleData?.lunch}
              packages={packages.Lunch}
            />
            <button>
              {organizedScheduleData?.lunch?.id ? <RefreshCw /> : <Check />}
            </button>
          </div>
        </div>
        <div className="flex gap-2 justify-between w-full max-w-sm">
          <p className="text-2xl ">Dinner </p>
          <div className="flex gap-2">
            <ScheduleSelect
              key={organizedScheduleData?.dinner?.id ?? Math.random()}
              // placeholder="Dinner"
              selected={organizedScheduleData?.dinner}
              packages={packages.Dinner}
            />
            <button>
              {organizedScheduleData?.dinner?.id ? <RefreshCw /> : <Check />}
            </button>
          </div>
        </div>
      </div>
      {/* console.log(') */}
    </div>
  );
}
