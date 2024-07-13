"use client"

import { DatePicker } from "@/components/admin/dashboard/DatePicker";
import { Calendar } from "@/components/ui/calendar";
import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";


export default function Schedule() {
  const [ date, setDate ] = useState<Date>()
  console.log(date)
  // const [schedule, setSchedule] = useState<TGetSchedule>([]);
  //   useEffect(()=>{
  //     async ()=> {
  //       const data =  await getSchedule();
  //       if(data){
  //         setSchedule(data)
  //       }

  //     }
  //   },[])
  return (
    <div>
      <h1 className="font-bold text-2xl text-center border-b py-4">Schedule</h1>
      {/* <Calendar mode="single" selected={date} onSelect={setDate} captionLayout="dropdown" className="border w-fit"/> */}
      <DatePicker/>
      {/* {JSOgit N.stringify(date)} */}
    </div>
  );
}
