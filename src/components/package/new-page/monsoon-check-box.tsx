"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getMonth } from "date-fns";
import { useEffect, useState } from "react";

export default function MonsoonCheckBox() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentTime = new Date(Date.now());
    const currentMonth = getMonth(currentTime);
    if (currentMonth >= 4 && currentMonth <= 6) {
      setIsVisible(true);
    }
  }, []);

  if (typeof window === "undefined") return;

  return (
    <div className={cn("flex items-center pb-2", { hidden: !isVisible })}>
      <Checkbox id="terms-and-privacy-condition" required aria-required />
      <Label
        htmlFor="terms-and-privacy-condition"
        className="ml-2 text-xs font-normal"
      >
        Due to monsoon restrictions, the sea cruise will not be available in
        June, July, and August. However, the same trip will be offered through
        the backwaters and ship channels.{" "}
      </Label>
    </div>
  );
}
