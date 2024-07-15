"use client";
import { trpc } from "@/app/_trpc/client";
import { Calendar } from "@/components/ui/calendar";
import { getPrevTimeStamp } from "@/lib/utils";
import {
  ScheduleSchema,
  TScheduleSchema,
} from "@/lib/validators/ScheduleValidtor";
import { zodResolver } from "@hookform/resolvers/zod";
import { Schedule } from "@prisma/client";
import { format } from "date-fns";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
export type TScheduleData = Omit<Schedule, "day"> & {day : string};
export default function DateSelector() {
  const [queryDate, setData] = useState<{ date: number | null }>({
    date: null,
  });
  const [scheduleData, setScheduleData] = useState<TScheduleData[] | null>();
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: { errors },
    getFieldState,
    control,
    trigger,
  } = useForm<TScheduleSchema>({
    resolver: zodResolver(ScheduleSchema),
  });


  const { fetch } = trpc.useUtils().getSchedule;


  async function HandleSubmit(queryData: TScheduleSchema) {
    console.log("submited");
    setData({ date: queryData.ScheduleDate });
    const data = await fetch({
      ScheduleDate: queryData.ScheduleDate,
    });
    setScheduleData(data);
  }

  watch("ScheduleDate");
  return (
    <div className="flex items-center flex-col justify-center">
      <form action="" onSubmit={handleSubmit(HandleSubmit)}>
        <Calendar
          mode="single"
          {...register}
          selected={new Date(getValues("ScheduleDate"))}
          onSelect={(Date) => {
            if (Date) {
              setValue("ScheduleDate", Date.getTime(), {
                shouldValidate: true,
                shouldDirty: true,
              });
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
