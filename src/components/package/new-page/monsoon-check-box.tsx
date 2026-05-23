"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getMonth } from "date-fns";

type TMonsoonCheckBox = {
  date: Date | string | undefined;
};

export default function MonsoonCheckBox({ date }: TMonsoonCheckBox) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  const month = getMonth(parsed);
  if (month < 5 || month > 7) return null;

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
