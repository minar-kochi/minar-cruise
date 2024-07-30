import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PackageSelect, TgetPackageScheduleDatas } from "@/db/data/dto/package";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { TselectDate } from "../ScheduleSelector";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import { useScheduleStore } from "@/providers/admin/schedule-store-provider";
import { selectedPackageIdsAndScheduleMapToEnum } from "@/Types/Schedule/ScheduleSelect";
import { cn } from "@/lib/utils";

export type FC_TScheduleSelect = {
  type: keyof TselectDate;
  packageKey: keyof Exclude<TgetPackageScheduleDatas, null>;
};

export default function ScheduleSelect({
  packageKey,
  type,
}: FC_TScheduleSelect) {
  const {
    updateSelectedSchedulePackageId,
    selectedSchedulePackageId,
    packages,
    organizedSchedule,
  } = useScheduleStore((state) => state);

  function CnhandleChange(value: string) {
    updateSelectedSchedulePackageId(type, {
      id: value,
      scheduleTime: selectedPackageIdsAndScheduleMapToEnum[type],
    });
  }

  function ReacthandleChange(e: ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    let value = e.target.value;
    if (!value) return;

    updateSelectedSchedulePackageId(type, {
      id: value,
      scheduleTime: selectedPackageIdsAndScheduleMapToEnum[type],
    });
  }

  
  const OriginSetPackage = useMemo(() => {
    return packages[packageKey].find(
      (value) =>
        value.id === (organizedSchedule && organizedSchedule[type]?.packageId)
    );
  }, [organizedSchedule]);

  
  let defaultOrSelect = useMemo(() => {
    return selectedSchedulePackageId && selectedSchedulePackageId[type]?.id
      ? selectedSchedulePackageId[type]?.id
      : organizedSchedule && organizedSchedule[type]?.packageId
      ? organizedSchedule[type]?.packageId
      : "";
  }, [selectedSchedulePackageId, organizedSchedule]);
  
  let shad = false;


  return shad ? (
    <select
      onChange={ReacthandleChange}
      value={defaultOrSelect}
      className="bg-black p-2 text-white"
    >
      <option
        value={organizedSchedule ? organizedSchedule[type]?.id : undefined}
      >
        {OriginSetPackage && OriginSetPackage.title
          ? OriginSetPackage.title
          : "Select a Package"}
      </option>
      {packages[packageKey].map((item) => {
        return (
          <option className="bg-black" key={item.id} value={item.id}>
            {item.title}
          </option>
        );
      })}{" "}
    </select>
  ) : (
    <Select
      value={defaultOrSelect}
      onValueChange={CnhandleChange}
      defaultValue={
        organizedSchedule && organizedSchedule[type]?.id
          ? organizedSchedule[type]?.id
          : undefined
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={"Select a Package"} />
      </SelectTrigger>
      <SelectContent>
        {packages[packageKey].map((item) => {
          return (
            <SelectItem key={item.id} value={item.id}>
              {item.title}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

{
  /* <select className="bg-black p-2 text-white">
  <option value={organizedSchedule ? organizedSchedule[type]?.id : undefined}>
    {organizedSchedule && organizedSchedule[type]?.id
      ? organizedSchedule[type]?.id
      : "This Package"}
  </option>
  {packages[packageKey].map((item) => {
    return (
      <option className="bg-black" key={item.id} value={item.id}>
        {item.title}
      </option>
    );
  })}{" "}
</select>; */
}
{
  /* <Select
      onValueChange={handleChange}
      defaultValue={organizedSchedule ? organizedSchedule[type]?.id : undefined}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={"Select a Package"} />
      </SelectTrigger>
      <SelectContent>
        {packages[packageKey].map((item) => {
          return (
            <SelectItem key={item.id} value={item.id}>
              {item.title}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select> */
}
