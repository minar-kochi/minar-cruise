"use client";

import { PopOverDatePicker } from "@/components/admin/dashboard/Schedule/PopOverScheduleDate";
import ScheduleDatePicker from "@/components/admin/dashboard/Schedule/ScheduleDatePicker";
import { InputLabel } from "@/components/cnWrapper/InputLabel";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { filterDateFromCalender } from "@/lib/utils";
import {
  exclusivePackageValidator,
  TExclusivePackageValidator,
} from "@/lib/validators/exclusivePackageContactValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { setDate } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { date } from "zod";
import {} from "embla-carousel";
import { Button } from "@/components/ui/button";

interface IExclusivePackageEnquiryCard {
  adultPrice: Number;
  childPrice: Number;
}
export default function ExclusivePackageEnquiryCard({
  adultPrice,
  childPrice,
}: IExclusivePackageEnquiryCard) {
  const [date, setDate] = useState<Date>(new Date(Date.now()));
  const { register, handleSubmit } = useForm<TExclusivePackageValidator>({
    resolver: zodResolver(exclusivePackageValidator),
  });

  
  function onSubmit() {
    try {
    } catch (e) {}
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-xl rounded-xl p-2 px-auto"
    >
      <Calendar
        sizeMode="lg"
        disabled={{ before: new Date(Date.now()) }}
        mode="single"
      />
      <InputLabel
        InputProps={{
          className: "border-0",
          placeholder: "Name",
          ...register("name"),
        }}
      />
      <InputLabel
        InputProps={{
          className: "border-0",
          placeholder: "Email",
          ...register("email"),
        }}
      />
      <InputLabel
        InputProps={{
          className: "border-0",
          placeholder: "Contact",
          ...register("phone"),
        }}
      />
      <InputLabel
        InputProps={{
          className: "border-0",
          placeholder: "Count",
          ...register("count"),
        }}
      />

      <InputLabel
        InputProps={{
          className: "border-0",
          placeholder: "Num of Hours. eg: 2",
          ...register("Duration"),
        }}
      />
      <Button type="submit">Enquire Now</Button>
    </form>
  );
}
