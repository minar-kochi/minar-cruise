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
    <div className={cn("flex gap-1", parentClassName)}>
      <div className={cn("w-1 h-1 bg-secondary", DiskClassName)} />
      <p className={cn("text-muted-foreground", titleClassName)}>{title}</p>
    </div>
  );
}
