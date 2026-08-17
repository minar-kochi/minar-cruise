"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import { setUpdatableScheduleTime } from "@/lib/features/schedule/ScheduleSlice";
import { scheduleTimeDraft } from "@/lib/features/schedule/selector";
import { TScheduleSelector } from "@/Types/type";
import { istMinutesToInput, istMinutesFromInput } from "@/lib/datetime";

/**
 * Departure and return for a CUSTOM / EXCLUSIVE schedule.
 *
 * This replaces three coupled dropdowns (hour × minute × AM/PM) whose combined
 * value was string-joined into `"4:30:PM"`, dispatched to redux, and re-split on
 * the way back out. That format then had to be parsed everywhere it was read,
 * and its unpadded-hour variant was rejected by one of the two validators — so
 * a legal time could render as a bare " - ".
 *
 * A native `<input type="time">` gives a 24-hour `"HH:MM"` value, which converts
 * to minutes-from-midnight with no ambiguity and no meridiem to lose. The store
 * holds the minutes; IST is applied when the instant is resolved at write time.
 */
export default function ExclusiveScheduleTime({ type }: TScheduleSelector) {
  const dispatch = useAppDispatch();
  const timer = useAppSelector((state) => scheduleTimeDraft(state, type));

  const onChange = (field: "startMinutes" | "endMinutes", value: string) => {
    const minutes = istMinutesFromInput(value);
    // An empty or partially-typed input yields null; store it as-is rather than
    // coercing to 0, which would silently mean midnight.
    dispatch(setUpdatableScheduleTime({ type, field, minutes }));
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor={`${type}-departs`}>Departs (IST)</Label>
        <Input
          id={`${type}-departs`}
          type="time"
          value={
            timer.startMinutes != null
              ? istMinutesToInput(timer.startMinutes)
              : ""
          }
          onChange={(e) => onChange("startMinutes", e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor={`${type}-returns`}>Returns (IST)</Label>
        <Input
          id={`${type}-returns`}
          type="time"
          value={
            timer.endMinutes != null ? istMinutesToInput(timer.endMinutes) : ""
          }
          onChange={(e) => onChange("endMinutes", e.target.value)}
        />
      </div>
    </div>
  );
}
