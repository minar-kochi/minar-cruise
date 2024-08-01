import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import { IsIdExclusive } from "@/lib/features/Package/selector";
import { DefaultMergedSchedule } from "@/lib/features/schedule/selector";
import { TKeyOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { TScheduleSelector } from "@/Types/type";
import React from "react";

export default function ExclusiveScheduleTime({ type }: TScheduleSelector) {
  const defaultSelect = useAppSelector((state) =>
    DefaultMergedSchedule(state, type),
  );
  const {updatedDateSchedule,currentDateSchedule} = useAppSelector((state) => state.schedule);

  const isExclusive = useAppSelector((state) =>
    IsIdExclusive(state, defaultSelect.packageId),
  );
  if (!isExclusive) return null;

  return <Input type="time" value={currentDateSchedule[type]?.time ?? undefined} />;
}
