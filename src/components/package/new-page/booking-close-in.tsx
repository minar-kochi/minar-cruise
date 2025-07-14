import { useClientSelector } from "@/hooks/clientStore/clientReducers";
import { findCorrespondingScheduleTimeFromPackageCategory } from "@/lib/Data/manipulators/ScheduleManipulators";
import { getPackageById } from "@/lib/features/client/packageClientSelectors";
import {
  checkBookingTimeConstraint,
  cn,
  combineDateAndTime,
  RemoveTimeStampFromDate,
} from "@/lib/utils";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isPast,
} from "date-fns";
import { useEffect, useState } from "react";

type TBookingCloseIn = {
  packageId: string;
  availableDates: string[] | undefined;
  disabled:
    | {
        day: Date;
      }[]
    | undefined;
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export default function BookingCloseIn({
  packageId,
  disabled,
  availableDates,
}: TBookingCloseIn) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const date = useClientSelector((state) => state.package.date);

  const availableDateFound = availableDates?.findIndex((item) => item === date);

  const isAvailable = availableDateFound !== -1;

  const disabledDate = disabled?.findIndex(
    (fv) => RemoveTimeStampFromDate(fv.day) === date,
  );
  const isDisabledDateFound = disabledDate !== -1;

  const packageTime = useClientSelector((state) =>
    getPackageById(state, packageId),
  );

  const fromTime = packageTime?.fromTime ?? "";
  const scheduleTimeForPackage = packageTime?.packageCategory
    ? findCorrespondingScheduleTimeFromPackageCategory(
        packageTime?.packageCategory,
      )
    : null;
  const isAvailableForNewBooking =
    date && scheduleTimeForPackage
      ? checkBookingTimeConstraint({
          selectedDate: date,
          startFrom: fromTime,
          scheduleTime: scheduleTimeForPackage,
        })
      : false;

  const unformattedDate =
    typeof date !== "string"
      ? RemoveTimeStampFromDate(new Date(date ?? Date.now()))
      : date;

  const selectedDate = combineDateAndTime(unformattedDate, fromTime);

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();

    if (isPast(selectedDate)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = differenceInDays(selectedDate, now);
    const hours = differenceInHours(selectedDate, now) % 24;
    const minutes = differenceInMinutes(selectedDate, now) % 60;
    const seconds = differenceInSeconds(selectedDate, now) % 60;

    return { days, hours, minutes, seconds, isExpired: false };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 10000);

    setTimeLeft(calculateTimeLeft());
    return () => clearInterval(timer);
  }, [selectedDate]);

  const getCompactTimeText = () => {
    if (isDisabledDateFound) return "Blocked";
    if (timeLeft.isExpired) return "Ship Sailed";
    if (!isAvailable && !isAvailableForNewBooking) return "Too late";

    const { days, hours, minutes, seconds } = timeLeft;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const totalMinutes =
    timeLeft.days * 24 * 60 + timeLeft.hours * 60 + timeLeft.minutes;

  return (
    <div
      className={cn(
        `inline-flex items-center  px-2 py-1 rounded-full my-2  font-medium border bg-green-100 text-green-700 border-green-200`,
        {
          "bg-red-100 text-red-700 border-red-200":
            timeLeft.isExpired ||
            totalMinutes <= 30 ||
            isDisabledDateFound ||
            (!isAvailable && !isAvailableForNewBooking),
          "bg-orange-100 text-orange-700 border-orange-200":
            totalMinutes <= 120,
        },
      )}
    >
      <span className="mr-1 text-md">🕗</span>
      <p className="text-sm font-semibold">{getCompactTimeText()}</p>
    </div>
  );
}
