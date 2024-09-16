import { trpc } from "@/app/_trpc/client";
import { cn, RemoveTimeStampFromDate } from "@/lib/utils";
import { $Enums } from "@prisma/client";
import { isSameDay } from "date-fns";
import { DayProps } from "react-day-picker";

interface IClientCalenderScheduleDay {
  props: DayProps;
  AvailableDate?: string[];
  blockedDate?: string[];
  packageCategory?: $Enums.PACKAGE_CATEGORY;
}

export default function ClientCalenderScheduleDay({
  AvailableDate,
  props,
  blockedDate,
  packageCategory,
}: IClientCalenderScheduleDay) {
  const { date } = props;

  const isAvailableDateFound = AvailableDate
    ? AvailableDate.findIndex((item) =>
        isSameDay(
          RemoveTimeStampFromDate(new Date(item)),
          RemoveTimeStampFromDate(date),
        ),
      )
    : -1;

  return (
    <span
      className={cn({
        "bg-green-500 rounded-md  relative z-0 w-full h-full flex items-center justify-center text-white font-bold ":
          isAvailableDateFound !== -1 &&
          AvailableDate &&
          AvailableDate[isAvailableDateFound] &&
          packageCategory !== "SUNSET",
      })}
    >
      {/* <div className="absolute w-full -bottom-[3px] left-0 items-center  justify-center flex gap-1">
        {isAvailableDateFound !== -1 &&
        AvailableDate &&
        AvailableDate[isAvailableDateFound] ? (
          <div className="w-1 h-1 bg-green-500  rounded-full" />
        ) : null}
      </div> */}
      {props.date.getDate()}
    </span>
  );
}
