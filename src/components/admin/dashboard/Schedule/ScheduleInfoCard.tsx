import { LucideProps, RefreshCw } from "lucide-react";
import React, { ReactNode } from "react";
export type LucideIcons = ReactNode;

export default function ScheduleInfoCard({
  Icon,
  lable,
}: {
  Icon: LucideIcons;
  lable: string;
}) {
  return (
    <div className="flex items-center gap-2 ">
      {Icon}
      <p className="text-xs text-muted-foreground">{lable}</p>
    </div>
  );
}
