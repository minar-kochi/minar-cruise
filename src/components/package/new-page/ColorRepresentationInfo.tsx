import { cn } from "@/lib/utils";
import React from "react";

export default function ColorRepresentationInfo({
  className,
  title,
  containerClass
}: {
  className: string;
  title: string;
  containerClass?:string
}) {
  return (
    <div className={cn("flex items-center justify-center gap-2 ", containerClass)}>
      <div className={cn("rounded-full w-4 h-4 bg-green-400 ", className)} />
      <p className="text-sm  font-medium">{title}</p>
    </div>
  );
}
