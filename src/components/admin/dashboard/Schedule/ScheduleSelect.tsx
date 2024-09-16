import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import { getPackageTitleWithTimeIfNotExists } from "@/lib/Data/manipulators/PackageManipulators";
import { setUpdatableScheduleDate } from "@/lib/features/schedule/ScheduleSlice";
import {
  DefaultMergedSchedule,
  scheduleIdAndPackageTitleSelector,
} from "@/lib/features/schedule/selector";
import { cn } from "@/lib/utils";
import { TScheduleSelector } from "@/Types/type";
export default function ScheduleSelect({ type }: TScheduleSelector) {
  const { OrganizedPackage } = useAppSelector((state) => state.packages);
  const { currentDateSchedule } = useAppSelector((state) => state.schedule);
  const defaultSelect = useAppSelector((state) =>
    DefaultMergedSchedule(state, type),
  );

  const dispatch = useAppDispatch();
  return currentDateSchedule[type]?.scheduleStatus === "BLOCKED" ? null : (
    <Select
      key={`select-ScheduleSelect-select-button-${type}`}
      defaultValue={currentDateSchedule[type]?.packageId ?? "false"}
      value={defaultSelect.packageId ?? "false"}
      onValueChange={(value) => {
        if (value === "false") return;
        dispatch(setUpdatableScheduleDate({ packageId: value, type }));
      }}
    >
      <SelectTrigger value={"false"} className="w-full">
        <SelectValue placeholder={"Select a Package"} />
      </SelectTrigger>
      <SelectContent sticky="always">
        <SelectItem value={"false"} key={`select-item-empty`}>
          <div className="flex items-center gap-1">Select a Package</div>
        </SelectItem>
        {OrganizedPackage[type].map((item) => {
          let title = getPackageTitleWithTimeIfNotExists(
            item.title,
            item.duration,
            item.packageCategory,
          );
          return (
            <SelectItem value={item.id} key={`select-item-${item.id}`}>
              <div className="flex items-center gap-2">
                {title}
                <div
                  className={cn(
                    "w-1 h-1 bg-green-500 animate-pulse rounded-full hidden",
                    {
                      block:
                        currentDateSchedule &&
                        currentDateSchedule[type]?.packageId === item.id,
                    },
                  )}
                />
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
