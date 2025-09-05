import {
  checkBookingTimeConstraint,
  cn,
  RemoveTimeStampFromDate,
} from "@/lib/utils";
import { isSunset } from "@/lib/validators/Package";
import { $Enums } from "@prisma/client";
import { isSameDay } from "date-fns";
import { DayContentProps, DayProps } from "react-day-picker";

interface IClientCalenderScheduleDay {
  props: DayContentProps;
  AvailableDate?: string[];
  blockedDate?: string[];
  packageCategory: $Enums.PACKAGE_CATEGORY;
  startFrom: string;
  isLoading: boolean;
}

const CalendarThemeConfig = {
  selected:
    "outline-blue-400 border-blue-400 border-2 outline-2 bg-blue-400   font-medium group-aria-selected:font-extrabold  text-white  group-aria-selected:blue-400",
  sunset:
    "hover:bg-[#3ab567] bg-[#25b058]   font-medium group-aria-selected:font-extrabold  text-white border-green-600 group-aria-selected:bg-[#088a38]",
  available:
    "bg-[#25b058]  hover:bg-[#3ab567] font-medium group-aria-selected:font-extrabold  text-white border-green-600 group-aria-selected:bg-[#088a38]",
  disabled:
    "group-disabled:bg-gray-200 group-disabled:border-none group-disabled:hover:bg-gray-300 group-disabled:text-gray-500",
  loading:
    "group-disabled:bg-gray-200 bg-gray-200 hover:bg-gray-200 group-disabled:hover:bg-gray-300 group-disabled:text-gray-500",
  blocked:
    "group-disabled:bg-red-500 group-disabled:text-white group-disabled:hover:bg-red-600 text-white font-bold",
  not_available:
    "text-white disabled bg-red-500 border-none hover:bg-red-700 text-white font-bold group-aria-selected:bg-red-600 group-aria-selected:hover:bg-red-700",
};

export default function ClientCalenderScheduleDay({
  AvailableDate,
  props,
  blockedDate,
  packageCategory,
  startFrom,
  isLoading,
}: IClientCalenderScheduleDay) {
  const { date, activeModifiers } = props;

  const idxOfAvailableDate = AvailableDate
    ? AvailableDate.findIndex((item) =>
        isSameDay(
          RemoveTimeStampFromDate(new Date(item)),
          RemoveTimeStampFromDate(date),
        ),
      )
    : -1;

  const isAvailableDateFound = idxOfAvailableDate !== -1;

  const isPackageSunset = isSunset(packageCategory);

  const isAvailableForNewBooking = checkBookingTimeConstraint({
    scheduleTime: packageCategory as $Enums.SCHEDULED_TIME,
    selectedDate: RemoveTimeStampFromDate(date),
    startFrom: startFrom,
  });

  let isBlocked = blockedDate
    ? blockedDate.findIndex((item) =>
        isSameDay(
          RemoveTimeStampFromDate(new Date(item)),
          RemoveTimeStampFromDate(date),
        ),
      )
    : -1;
  // rounded-md hover:bg-blue-400  relative z-0 w-full h-full flex items-center justify-center group-disabled:text-muted group-disabled:font-bold group-disabled:bg-transparent  bg-yellow-200
  const disabled = CalendarThemeConfig.disabled;
  const loading_color = CalendarThemeConfig.loading;
  const blocked = CalendarThemeConfig.blocked;
  const not_available_booking = CalendarThemeConfig.not_available;
  const available = activeModifiers.selected
    ? CalendarThemeConfig.selected
    : CalendarThemeConfig.available;
  const sunSetAvailable = activeModifiers.selected
    ? CalendarThemeConfig.selected
    : CalendarThemeConfig.sunset;

  // let isSunsetBookable = false;

  // if (packageCategory === "SUNSET") {
  //   const isAvailable = AvailableDate && AvailableDate[idxOfAvailableDate];

  //   isSunsetBookable =  isAvailableForNewBooking ?
  //   console.log("SUNSET BOOKABLE ? ", startFrom);
  // }
  const isAvailableShown =
    isAvailableDateFound && AvailableDate && AvailableDate[idxOfAvailableDate];
  return (
    <span
      className={cn(
        "rounded-md relative z-0 border border-muted-foreground w-full h-full flex  items-center justify-center ",
        disabled,

        {
          [`${available}`]:
            isAvailableDateFound &&
            AvailableDate &&
            AvailableDate[idxOfAvailableDate],
          [`${sunSetAvailable}`]: isPackageSunset && isAvailableForNewBooking,
          [`${blocked}`]: isBlocked !== -1,
          [`${not_available_booking}`]:
            !isAvailableShown && !isAvailableForNewBooking,
          [`${loading_color}`]: isLoading,
        },
      )}
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
