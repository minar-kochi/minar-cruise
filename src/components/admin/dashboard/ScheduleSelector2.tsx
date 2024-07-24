import React, { Dispatch, SetStateAction } from "react";
import ScheduleSelect from "./Schedule/ScheduleSelect";
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
  const { packages, organizedSchedule } = useScheduleStore((state) => state);
  return (
    <div className="w-full ">
      <Label className="text-lg">{label}</Label>
      <div className="flex w-full  justify-between gap-2">
        <div className="w-full flex flex-col gap-2">
          <ScheduleSelect type={type} packageKey={packageKey} />
          <div>
            {packageKey && id && isIdExclusive(packages[packageKey], id) ? (
              <Input type="time" />
            ) : null}
          </div>
        </div>
        <div className="flex">
          {organizedSchedule && organizedSchedule[type]?.id ? (
            <ScheduleUpdateButton />
          ) : (
            <ScheduleAddButton type={type} />
          )}
        </div>
      </div>
    </div>
  );
}
