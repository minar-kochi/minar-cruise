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
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

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

export const BookingCloseIn = ({
  packageId,
  disabled,
  availableDates,
}: TBookingCloseIn) => {
  const timerRef = useRef<NodeJS.Timeout>();
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

  // Memoize the selectedDate to prevent unnecessary recalculations
  const selectedDate = useMemo(() => {
    const unformattedDate =
      typeof date !== "string"
        ? RemoveTimeStampFromDate(new Date(date ?? Date.now()))
        : date;
    return combineDateAndTime(unformattedDate, fromTime);
  }, [date, fromTime]);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date();

    if (isPast(selectedDate)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = differenceInDays(selectedDate, now);
    const hours = differenceInHours(selectedDate, now) % 24;
    const minutes = differenceInMinutes(selectedDate, now) % 60;
    const seconds = differenceInSeconds(selectedDate, now) % 60;

    return { days, hours, minutes, seconds, isExpired: false };
  }, [selectedDate]);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Calculate initial time immediately
    setTimeLeft(calculateTimeLeft());

    // Set up the interval
    timerRef.current = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000); // Changed to 1 second for better UX

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [calculateTimeLeft]); // Only depend on calculateTimeLeft, which is memoized with selectedDate

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
        `px-2 py-1  rounded-md my-2 border bg-green-100 text-green-700 border-green-200 text-sm font-semibold`,
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
      <p className="">
        Booking Status: <span className="mr-1 text-md">🕗</span>
        {getCompactTimeText()}
      </p>
    </div>
  );
};

export default memo(BookingCloseIn);
