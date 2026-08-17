"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { monthOfKey, parseIstDayKey } from "@/lib/datetime";

type TMonsoonCheckBox = {
  /** The form's `selectedScheduleDate` — a YYYY-MM-DD day key, never a Date. */
  date: string | undefined;
};

export default function MonsoonCheckBox({ date }: TMonsoonCheckBox) {
  if (!date) return null;
  const day = parseIstDayKey(date);
  if (!day) return null;
  // `monthOfKey` is 1-based (Luxon's convention); date-fns `getMonth` was
  // 0-based, so the old `< 5 || > 7` guard meant Jun/Jul/Aug — the monsoon.
  const month = monthOfKey(day);
  if (month < 6 || month > 8) return null;

  return (
    <div className="flex items-center pb-2">
      <Checkbox id="monsoon-restriction-ack" required aria-required />
      <Label
        htmlFor="monsoon-restriction-ack"
        className="ml-2 text-xs font-normal"
      >
        Due to monsoon restrictions, the sea cruise will not be available in
        June, July, and August. However, the same trip will be offered through
        the backwaters and ship channels.{" "}
      </Label>
    </div>
  );
}
