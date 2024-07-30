import React, { Dispatch, SetStateAction, useMemo } from "react";
import ScheduleSelect from "./Schedule/_ScheduleSelect";
import { TOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { PackageSelect, TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TScheduleSchema } from "@/lib/validators/ScheduleValidtor";
import { Label } from "@/components/ui/label";
import { isIdExclusive } from "@/lib/helpers/ExclusivePackage";
import { Input } from "@/components/ui/input";
import { Check, RefreshCw } from "lucide-react";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import { TselectDate } from "./ScheduleSelector";
import { useScheduleStore } from "@/providers/admin/schedule-store-provider";
import ScheduleUpdateButton from "./ScheduleUpdateButton";
import ScheduleAddButton from "./ScheduleAddButton";
import ScheduleBlockButton from "./ScheduleBlockButton";

interface IScheduleSelector {
  id?: string | null;
  label: string;
  packageKey: keyof Exclude<TgetPackageScheduleDatas, null>;
  type: keyof TselectDate;
}

export default function ScheduleSelectorDynamic({
  id,
  label,
  type,
  packageKey,
}: IScheduleSelector) {
  const { packages, organizedSchedule, selectedSchedulePackageId } =
    useScheduleStore((state) => state);

  let defaultOrSelect = useMemo(() => {
    return selectedSchedulePackageId && selectedSchedulePackageId[type]?.id
      ? selectedSchedulePackageId[type]?.id
      : organizedSchedule && organizedSchedule[type]?.packageId
      ? organizedSchedule[type]?.packageId
      : "";
  }, [selectedSchedulePackageId, organizedSchedule]);

  return (
    <div className="w-full ">
      <Label className="text-lg">{label}</Label>
      <div className="flex w-full  justify-between gap-2">
        <div className="w-full flex flex-col gap-2">
          <ScheduleSelect type={type} packageKey={packageKey} />

          <div>
            {packageKey &&
            defaultOrSelect &&
            isIdExclusive(packages[packageKey], defaultOrSelect) ? (
              <Input type="time" />
            ) : null}
            <div className="w-full"></div>
          </div>
        </div>
        <div className="">
          <div className="flex gap-1">
            {organizedSchedule && organizedSchedule[type]?.id ? (
              <ScheduleUpdateButton />
            ) : (
              <ScheduleAddButton type={type} />
            )}
            <ScheduleBlockButton />
          </div>
        </div>
      </div>
    </div>
  );
}
