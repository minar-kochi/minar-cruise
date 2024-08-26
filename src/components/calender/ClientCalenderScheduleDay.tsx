import { trpc } from "@/app/_trpc/client";
import { isSameDay } from "date-fns";
import { DayProps } from "react-day-picker";

interface IClientCalenderScheduleDay {
  props: DayProps;
  AvailableDate?: string[];
}

export default function ClientCalenderScheduleDay({
  AvailableDate,
  props,
}: IClientCalenderScheduleDay) {
  const { date } = props;

  const isLunchFound = AvailableDate
    ? AvailableDate.findIndex((item) => isSameDay(new Date(item), date))
    : -1;

  return (
    <span className="">
      <div className="absolute w-full -bottom-[3px] left-0 items-center  justify-center flex gap-1">
        {isLunchFound !== -1 && AvailableDate && AvailableDate[isLunchFound] ? (
          <div className="w-1 h-1 bg-green-500  rounded-full" />
        ) : null}
      </div>
      {props.date.getDate()}
    </span>
  );
}
