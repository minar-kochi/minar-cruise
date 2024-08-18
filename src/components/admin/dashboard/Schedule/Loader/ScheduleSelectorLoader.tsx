import React from "react";
import ScheduleAddButton from "../ScheduleAddButton";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function ScheduleSelectorLoader({ title }: { title: string }) {
  return (
    <div className="my-2">
      <label htmlFor="" className="my-0.5">
        {title}
      </label>
      <div className="flex gap-2">
        <Skeleton className="h-10 p-1 w-full" />
        <button className="rounded-xl border p-2 hover:bg-secondary">
          <Loader2 className="h-5 w-5 animate-spin" />
        </button>
      </div>
      <div className="my-2"></div>
    </div>
  );
}
