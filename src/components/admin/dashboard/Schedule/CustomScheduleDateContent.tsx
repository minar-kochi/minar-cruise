import { useAppSelector } from "@/hooks/adminStore/reducer";
import { isSameDay } from "@/lib/utils";
import { DayContentProps } from "react-day-picker";

export function CustomDayContentWithScheduleIndicator(props: DayContentProps) {
  const data = useAppSelector((state) => state.schedule.upComingSchedules);

  const { date } = props;

  const isLunchFound = data.lunch.findIndex((item) =>
    isSameDay(new Date(item.date), date),
  );

  const isBreakfastFound = data.breakfast.findIndex((item) =>
    isSameDay(new Date(item.date), date),
  );
  const isDinner = data.dinner.findIndex((item) =>
    isSameDay(new Date(item.date), date),
  );
  const isSunset = data.sunset.findIndex((item) =>
    isSameDay(new Date(item.date), date),
  );
  const isCustom = data.custom.findIndex((item) =>
    isSameDay(new Date(item.date), date),
  );
  return (
    <span className="">
      <div className="absolute w-full -bottom-[3px] left-0 items-center  justify-center flex gap-1">
        {isBreakfastFound !== -1 && data.breakfast[isBreakfastFound].date ? (
          <div className="w-1 h-1 bg-cyan-600  rounded-full" />
        ) : null}
        {isLunchFound !== -1 && data.lunch[isLunchFound].date ? (
          <div className="w-1 h-1 bg-lime-500  rounded-full" />
        ) : null}
        {isSunset !== -1 && data.sunset[isSunset].date ? (
          <div className="w-1 h-1 bg-orange-600  rounded-full" />
        ) : null}
        {isDinner !== -1 && data.dinner[isDinner].date ? (
          <div className="w-1 h-1 bg-violet-500  rounded-full" />
        ) : null}

        {isCustom !== -1 && data.custom[isCustom].date ? (
          <div className="w-1 h-1 bg-white  rounded-full" />
        ) : null}
      </div>
      {props.date.getDate()}
    </span>
  );
}
