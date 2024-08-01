import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import { useIsIdExclusive } from "@/lib/features/Package/selector";
import { useDefaultMergedSchedule } from "@/lib/features/schedule/selector";
import { TKeyOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { TScheduleSelector } from "@/Types/type";
import React from "react";

export default function ExclusiveScheduleTime({ type }: TScheduleSelector) {
  const defaultSelect = useAppSelector((state) =>
    useDefaultMergedSchedule(state, type),
  );
  const {updatedDateSchedule,currentDateSchedule} = useAppSelector((state) => state.schedule);

  const isExclusive = useAppSelector((state) =>
    useIsIdExclusive(state, defaultSelect.packageId),
  );
  if (!isExclusive) return null;

  return <Input type="time" value={currentDateSchedule[type]?.time ?? undefined} />;
}
