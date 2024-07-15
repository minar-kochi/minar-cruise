"use client";
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
export default function DateSelector({
  data,
}: {
  data: TScheduleOrganizedData;
}) {
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
    <div className="flex items-center flex-col justify-center">
      <form action="" onSubmit={handleSubmit(HandleSubmit)}>
        <Calendar
          components={{
            DayContent: (props) =>
              CustomDayContentWithScheduleIndicator(props, data),
          }}
          // toDate={}
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
      <div>
        {JSON.stringify(scheduleData)}
        {/* <p>Data Received from Query...</p> */}
        {/* <p>Package Id : {query.data[0].}</p> */}
        {scheduleData && scheduleData?.length > 0
          ? scheduleData.map((item) => {
              return (
                <div key={`${item.id}-${item.packageId}`}>
                  <p>Schedule Id : {item.id}</p>
                  <p>Date : {format(item.day, "dd MM yyy")}</p>
                  <p>PackageID : {item.packageId}</p>
                  <p>Scheduled Package : {item.schedulePackage}</p>
                  <p>Scheduled Status : {item.scheduleStatus}</p>
                </div>
              );
            })
          : null}
      </div>
      {/* console.log(') */}
    </div>
  );
}
