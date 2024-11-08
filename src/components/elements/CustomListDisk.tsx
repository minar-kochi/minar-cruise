import { cn } from "@/lib/utils";
import React from "react";
export type TCustomListDisk = {
  title: string;
  DiskClassName?: string;
  parentClassName?: string;
  titleClassName?: string;
};
export default function CustomListDisk({
  title,
  DiskClassName,
  parentClassName,
  titleClassName,
}: TCustomListDisk) {
  return (
    <div className="border-2 ">
      <div
        className={cn(
          "flex items-center justify-center gap-1",
          parentClassName,
        )}
      >
        <div className={cn("w-1 h-1 rounded-full bg-white", DiskClassName)} />
        <p className={cn("text-muted-foreground", titleClassName)}>{title}</p>
      </div>
    </div>
  );
}
