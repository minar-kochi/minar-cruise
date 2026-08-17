"use client";
import { trpc } from "@/app/_trpc/client";
import ClientCalenderScheduleDay from "@/components/calender/ClientCalenderScheduleDay";
import { Calendar } from "@/components/ui/calendar";
import {
  cn,
  filterDateFromCalender,
  parseDateFormatYYYMMDDToNumber,
} from "@/lib/utils";
import { IstDayKey, calendarDateToDayKey, dayKeyOfDateColumn, istToday } from "@/lib/datetime";
import { $Enums } from "@prisma/client";
import { Info, Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { SelectSingleEventHandler } from "react-day-picker";
import CalendarPopover from "./CalendarPopover";
import toast from "react-hot-toast";
import { useClientSelector } from "@/hooks/clientStore/clientReducers";
import { getPackageById } from "@/lib/features/client/packageClientSelectors";
import { useAppDispatch } from "@/hooks/adminStore/reducer";
import { setDate } from "@/lib/features/client/packageClientSlice";
import { TPackageBookingRule } from "@/lib/config/bookingConfig.types";
import BookingCloseIn from "./booking-close-in";
import { keepPreviousData } from "@tanstack/react-query";

type TBookingFormCalender = {
  setFormDateValue: (value: string) => void;
  setScheduleId: (value: string | undefined) => void;
  packageId: string;
  packageCategory: $Enums.PACKAGE_CATEGORY;
  popoverCalender?: true | false;
  className?: string;
  /**
   * This package's resolved booking rule, read on the server and passed down.
   * Reading it from module constants here would bake the cutoff into the client
   * bundle and an admin edit could never reach the browser without a redeploy.
   */
  bookingRule: TPackageBookingRule;
};

/**
 * Parse a `YYYY-MM-DD` string back into a Date at LOCAL midnight.
 *
 * `new Date("2026-08-20")` parses as UTC midnight, which renders as the 19th for
 * anyone west of UTC — so the day the calendar highlights, and the month it
 * opens on, could disagree with the string the form is about to submit. These
 * strings were produced by the since-deleted `RemoveTimeStampFromDate`, which
 * formatted in local time,
 * so parsing them back in local time is what makes the round-trip exact.
 */
function parseLocalDate(value: string): Date | null {
  const parsed = parseDateFormatYYYMMDDToNumber(value);
  if (!parsed) return null;
  return new Date(parsed.year, parsed.month - 1, parsed.day);
}

export default function BookingFormCalender({
  setFormDateValue,
  setScheduleId,
  packageId,
  packageCategory,
  popoverCalender,
  className,
  bookingRule,
}: TBookingFormCalender) {
  const packageData = useClientSelector((state) =>
    getPackageById(state, packageId),
  );

  const date = useClientSelector((state) => state.package.date);
  const dispatch = useAppDispatch();

  /**
   * Seed the visible month from the current selection rather than from today.
   * The selected date lives in a store mounted on the (user) layout, so it
   * survives navigation between package pages and can be months away from now.
   * If its month is never fetched, the lookup below finds no schedule and an
   * available date silently falls into the "needs 30 guests" path.
   */
  const [month, setMonth] = useState<string>(
    () => date ?? istToday(),
  );

  const { data, isPending, isError } =
    trpc.user.getSchedulesByPackageIdAndDate.useQuery(
      {
        packageId: packageId,
        date: month,
      },
      /**
       * Without this the query key changing (month paging) blanks `data` until
       * the new fetch lands, leaving a window where the calendar is rendered
       * with no schedules at all.
       */
      { placeholderData: keepPreviousData },
    );

  // These feed day-key comparisons downstream, so convert once here rather than
  // letting raw Dates and day keys mix in the calendar predicates. `item.day` is
  // a @db.Date column, so it is already a calendar day — reading its UTC fields
  // is what preserves it; shifting it into IST would be treating it as an
  // instant.
  const availableDateArray = data?.schedules
    .map((item) => dayKeyOfDateColumn(item.day))
    .filter((d): d is IstDayKey => d !== null);

  const blockedDateArray = data?.blockedScheduleDateArray
    .map((item) => dayKeyOfDateColumn(item.day))
    .filter((d): d is IstDayKey => d !== null);

  const disabledDays = data?.blockedScheduleDateArray.map((item) => ({
    day: item.day,
  }));

  /**
   * The schedule for the selected day, DERIVED from (selection, fetched
   * schedules) rather than assigned inside `onSelect`.
   *
   * It used to be a side effect of a click, which meant any path that moved the
   * date without a successful click left the previous day's id behind: `onSelect`
   * wrote the new date and then returned early when the month query had no data,
   * and a date carried in from another package page was never accompanied by a
   * click at all. The server then attached the booking to that stale id — days
   * away from what the customer picked. As a derived value the pair cannot drift:
   * whenever the date or the fetched schedules change, the id is recomputed or
   * cleared.
   */
  const selectedSchedule = useMemo(() => {
    if (!date || !data?.schedules) return undefined;
    return data.schedules.find(
      (fv) => dayKeyOfDateColumn(fv.day) === date,
    );
  }, [date, data]);

  useEffect(() => {
    setScheduleId(selectedSchedule?.id);
  }, [selectedSchedule, setScheduleId]);

  const monthDate = useMemo(
    () => parseLocalDate(month) ?? new Date(Date.now()),
    [month],
  );

  const selectedDate = useMemo(
    () => (date ? parseLocalDate(date) : null) ?? new Date(Date.now()),
    [date],
  );

  /**
   * `isPending` alone is not enough: once react-query exhausts its retries the
   * query settles into an error state, `isPending` goes false and the overlay
   * would disappear while `data` is still undefined — leaving a fully clickable
   * calendar with no schedules behind it.
   */
  const isCalendarBusy = isPending || isError || !data;

  const handleSelect: SelectSingleEventHandler = (
    selected,
    _day,
    modifiers,
  ) => {
    if (modifiers.disabled) {
      toast.error("This date is disabled");
      return;
    }

    if (!selected) return;

    const nextDate = calendarDateToDayKey(selected);
    dispatch(setDate(nextDate));
    setFormDateValue(nextDate);

    // scheduleId is handled by the effect above; this only explains to the
    // customer why a day with no schedule yet carries a minimum party size.
    const hasSchedule = data?.schedules.some(
      (fv) => dayKeyOfDateColumn(fv.day) === nextDate,
    );

    // A package whose rule sets no minimum (Sunset, by default) sails with any
    // party size, so there is nothing to warn about.
    const minGuests = bookingRule.minNewBookingCount;

    if (data && !hasSchedule && minGuests !== null) {
      toast(
        `This date requires at least ${minGuests} guests to set sail! 🌊✨`,
        {
          className:
            "rounded-full bg-blue-50 border h-20 text-xl border-blue-300 text-blue-900 shadow-md",
          duration: 5000,
          icon: <Info className="text-blue-600" />,
          position: "top-center",
          ariaProps: { "aria-live": "polite", role: "alert" },
        },
      );
    }
  };

  if (!packageData) return null;

  /**
   * One definition shared by the popover and inline layouts. These were two
   * byte-identical copies; the stale-id bug had to be fixed in both, and letting
   * them drift again is how it comes back.
   */
  const calendar = (
    <Calendar
      className={cn({ "p-0 py-3 px-2": !popoverCalender })}
      sizeMode={"lg"}
      mode="single"
      month={monthDate}
      onMonthChange={(nextMonth) => {
        setMonth(calendarDateToDayKey(nextMonth));
      }}
      disabled={(day) =>
        filterDateFromCalender({
          date: day,
          dateArray: disabledDays,
          startMinutesIst: packageData.startMinutesIst ?? 0,
          AvailableDate: availableDateArray,
          rule: bookingRule,
        })
      }
      classNames={
        popoverCalender
          ? { button: "[&>button]:aria-selected:bg-black" }
          : undefined
      }
      components={{
        DayContent: (props) =>
          ClientCalenderScheduleDay({
            AvailableDate: availableDateArray,
            props,
            packageCategory,
            blockedDate: blockedDateArray,
            startMinutesIst: packageData.startMinutesIst ?? 0,
            isLoading: isCalendarBusy,
            bookingRule,
          }),
      }}
      selected={selectedDate}
      onSelect={handleSelect}
    />
  );

  const loadingOverlay = (
    <div
      className={cn("absolute inset-0 bg-gray-200/70 z-20 animate-pulse", {
        hidden: !isCalendarBusy,
      })}
    >
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex items-center justify-center gap-2 p-2 bg-white rounded-md">
          <Loader2 className="animate-spin" />
          <p>Loading Schedules...</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <BookingCloseIn
        disabled={disabledDays}
        packageId={packageId}
        bookingRule={bookingRule}
      />
      {popoverCalender ? (
        <CalendarPopover date={date}>
          <div
            className={cn(
              "rounded-md overflow-hidden shadow-xl   bg-primary-foreground   relative",
              className,
            )}
          >
            {calendar}
            {loadingOverlay}
          </div>
        </CalendarPopover>
      ) : (
        <div className="  py-4 rounded-md overflow-hidden shadow-xl    bg-primary-foreground  border-black relative">
          {calendar}
          {loadingOverlay}
        </div>
      )}
      <div className="my-2">
        <p className="pb-5 font-semibold text-sm">
          <sup>*</sup>Boarding Time: 30 mins before schedule time
        </p>
        <p className="text-xs pb-2 font-semibold text-center">
          All Date are in IST
          <br />
          <span>(Indian Standard Time)</span>
        </p>
      </div>
    </>
  );
}
