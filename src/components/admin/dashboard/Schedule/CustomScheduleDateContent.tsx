import { useAppSelector } from "@/hooks/adminStore/reducer";
import { isSameDay } from "@/lib/utils";
import { DayContentProps } from "react-day-picker";

export function CustomDayContentWithScheduleIndicator(props: DayContentProps) {
  const data = useAppSelector((state) => state.schedule.upCommingSchedules);

  const { date } = props;

  const isLunchFound = data.lunch.filter((item) =>
    isSameDay(new Date(item), date),
  );

  const isBreakfastFound = data.breakfast.filter((item) =>
    isSameDay(new Date(item), date),
  );
  const isDinner = data.dinner.filter((item) =>
    isSameDay(new Date(item), date),
  );
  const isCustom = data.custom.filter((item) =>
    isSameDay(new Date(item), date),
  );

  return (
    <span className="">
      <div className="absolute w-full -bottom-[3px] left-0 items-center  justify-center flex gap-1">
        {isBreakfastFound.length ? (
          <div className="w-1 h-1 bg-cyan-600  rounded-full" />
        ) : null}
        {isLunchFound.length ? (
          <div className="w-1 h-1 bg-lime-500  rounded-full" />
        ) : null}
        {isDinner.length ? (
          <div className="w-1 h-1 bg-orange-600  rounded-full" />
        ) : null}
        {isCustom.length ? (
          <div className="w-1 h-1 bg-rose-800  rounded-full" />
        ) : null}
      </div>
      {props.date.getDate()}
    </span>
  );
}
