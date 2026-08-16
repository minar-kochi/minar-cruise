import { calendarDateToDayKey, dayKeyOfDateColumn, getBookingWindow, istInstant, parseIstDayKey } from "@/lib/datetime";
import { useClientSelector } from "@/hooks/clientStore/clientReducers";
import { getPackageById } from "@/lib/features/client/packageClientSelectors";
import { TPackageBookingRule } from "@/lib/config/bookingConfig.types";
import { cn } from "@/lib/utils";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

type TBookingCloseIn = {
  packageId: string;
  disabled:
    | {
        day: Date;
      }[]
    | undefined;
  /** This package's resolved booking rule, threaded down from the server. */
  bookingRule: TPackageBookingRule;
};

/**
 * `unknown` means the departure time could not be parsed — render a status, not
 * a number. Before this existed the component fell through to the counting
 * branch with NaN counters and printed "NaNs".
 */
type BookingPhase = "open" | "closed" | "departed" | "unknown";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Kept in state so the label and the colour band read one snapshot. */
  totalMinutes: number;
  phase: BookingPhase;
}

const ZERO_COUNTERS = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalMinutes: 0,
};

export const BookingCloseIn = ({
  packageId,
  disabled,
  bookingRule,
}: TBookingCloseIn) => {
  const timerRef = useRef<NodeJS.Timeout>();
  /**
   * Zeroed on purpose: nothing in the render body reads the clock, so the server
   * markup and the first client render agree. The first live value lands in the
   * effect below, after hydration.
   */
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    ...ZERO_COUNTERS,
    phase: "open",
  });

  const date = useClientSelector((state) => state.package.date);

  /**
   * `?? -1` matters: `disabled` is undefined while the month's schedule query is
   * in flight, and `undefined !== -1` is true — which used to flash a red
   * "Blocked" badge on every calendar load.
   */
  const isDisabledDateFound =
    (disabled?.findIndex((fv) => dayKeyOfDateColumn(fv.day) === date) ??
      -1) !== -1;

  const packageTime = useClientSelector((state) =>
    getPackageById(state, packageId),
  );

  // The package's departure as IST minutes-from-midnight; the instant is derived
  // per selected date below.
  const startMinutesIst = packageTime?.startMinutesIst ?? null;

  const minLeadTimeHours = bookingRule.minLeadTimeHours;

  /**
   * The window this badge counts down to. Gated on the date alone — deliberately
   * not on whether a schedule already exists for it, because
   * `filterDateFromCalender` disables days on the lead time alone. Gating here
   * on availability is what let the badge keep counting down on a date the
   * calendar had already greyed out.
   *
   * Deps are primitives only. `bookingRule` is an object prop rebuilt upstream,
   * so listing it would hand `calculateTimeLeft` a fresh identity on every
   * parent render and tear the 1s interval down each time — the re-render
   * regression fixed in 2af0c93.
   */
  const bookingWindow = useMemo(() => {
    // The countdown is for a date the customer has selected but which may have
    // no Schedule row yet, so the departure is derived from the package's IST
    // time-of-day — the same value the schedule would be written with.
    if (startMinutesIst === null || startMinutesIst === undefined) return null;
    const dayKey =
      typeof date === "string"
        ? parseIstDayKey(date)
        : calendarDateToDayKey(new Date(date ?? Date.now()));
    if (!dayKey) return null;
    return getBookingWindow({
      departsAt: istInstant(dayKey, startMinutesIst),
      minLeadTimeHours,
    });
  }, [date, startMinutesIst, minLeadTimeHours]);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    if (!bookingWindow) {
      return { ...ZERO_COUNTERS, phase: "unknown" };
    }

    const now = new Date();
    const { closesAt, departureAt } = bookingWindow;

    // Departure first: with minLeadTimeHours = 0 the two instants coincide, and
    // "Ship Sailed" is the more informative of the two states.
    if (now.getTime() >= departureAt.getTime()) {
      return { ...ZERO_COUNTERS, phase: "departed" };
    }
    if (now.getTime() >= closesAt.getTime()) {
      return { ...ZERO_COUNTERS, phase: "closed" };
    }

    return {
      days: differenceInDays(closesAt, now),
      hours: differenceInHours(closesAt, now) % 24,
      minutes: differenceInMinutes(closesAt, now) % 60,
      seconds: differenceInSeconds(closesAt, now) % 60,
      totalMinutes: differenceInMinutes(closesAt, now),
      phase: "open",
    };
  }, [bookingWindow]);

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
  }, [calculateTimeLeft]); // Only depend on calculateTimeLeft, which is memoized with bookingWindow

  const isCounting = !isDisabledDateFound && timeLeft.phase === "open";

  const getStatusText = () => {
    if (isDisabledDateFound) return "Blocked";
    if (timeLeft.phase === "unknown") return "Unavailable";
    if (timeLeft.phase === "departed") return "Ship Sailed";
    return "Booking Closed";
  };

  const getCompactTimeText = () => {
    const { days, hours, minutes, seconds } = timeLeft;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  /**
   * The two bands are mutually exclusive rather than layered. `cn` is
   * twMerge(clsx(...)), which keeps the LAST conflicting utility, so an
   * overlapping orange rule listed after red silently won at <= 30 minutes and
   * on every non-counting badge.
   */
  return (
    <div
      className={cn(
        `px-2 py-1  rounded-md my-2 border bg-green-100 text-green-700 border-green-200 text-sm font-semibold`,
        {
          "bg-orange-100 text-orange-700 border-orange-200":
            isCounting &&
            timeLeft.totalMinutes > 30 &&
            timeLeft.totalMinutes <= 120,
          "bg-red-100 text-red-700 border-red-200":
            !isCounting || timeLeft.totalMinutes <= 30,
        },
      )}
    >
      <p className="">
        {isCounting ? (
          <>
            Time left: <span className="mr-1 text-md">🕗</span>
            {getCompactTimeText()}
          </>
        ) : (
          getStatusText()
        )}
      </p>
    </div>
  );
};

export default memo(BookingCloseIn);
