import { TScheduleOrganizedData } from "@/db/data/dto/schedule";
import { isSameDay } from "@/lib/utils";
import { DayContentProps } from "react-day-picker";

export function CustomDayContentWithScheduleIndicator(
  props: DayContentProps,
  data: TScheduleOrganizedData
) {
  const { date, displayMonth } = props;
  const isLunchFound = data.Lunch.filter((item) => isSameDay(item, date));
  const isBreakfastFound = data.BreakFast.filter((item) =>
    isSameDay(item, date)
  );
  const isDinner = data.Dinner.filter((item) => isSameDay(item, date));
  return (
    <span {...props}>
      <div className="absolute h-2 w-full bottom-0 flex gap-1">
        {isLunchFound.length ? (
          <div className="w-1 h-1 bg-cyan-400  rounded-full" />
        ) : null}
        {isBreakfastFound.length ? (
          <div className="w-1 h-1 bg-lime-500  rounded-full" />
        ) : null}
        {isDinner.length ? (
          <div className="w-1 h-1 bg-orange-600  rounded-full" />
        ) : null}
      </div>
      {props.date.getDate()}
    </span>
  );
}
