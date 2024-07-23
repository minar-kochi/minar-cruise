import React, { Dispatch, SetStateAction } from "react";
import ScheduleSelect from "./Schedule/ScheduleSelect";
import { TOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { PackageSelect, TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TScheduleSchema } from "@/lib/validators/ScheduleValidtor";
import { Label } from "@/components/ui/label";
import { isIdExclusive } from "@/lib/helpers/ExclusivePackage";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { TScheduleDataDayReplaceString } from "@/Types/type";
import { TselectDate } from "./ScheduleSelector";
import { useScheduleStore } from "@/providers/admin/schedule-store-provider";

interface IScheduleSelector {
  id?: string | null;
  label: string;
  packageKey?: keyof Exclude<TgetPackageScheduleDatas, null>;
  type: keyof TselectDate;
}

export default function ScheduleSelectorDynamic({
  id,
  label,
  type,
  packageKey,
}: IScheduleSelector) {
  const packages = useScheduleStore((state) => state.packages);
  return (
    <div className="w-full ">
      <Label className="text-lg">{label}</Label>
      <div className="flex w-full  justify-between gap-2">
        <div className="w-full flex flex-col gap-2">
          <ScheduleSelect
            type={type}
            packages={
              packageKey
                ? packages[packageKey]
                : packages.BreakFast.filter(
                    (item) => item.packageCategory === "EXCLUSIVE"
                  )
            }
          />
          <div>
            {isIdExclusive(packages[packageKey ?? "BreakFast"], id ?? "null") ? (
              <>
                <Input type="time" />
              </>
            ) : null}
          </div>
        </div>
        <div className="">
          <button className="p-2  border rounded-xl hover:bg-secondary">
            <Check className="h-5  w-5" />
          </button>
          {/* Show the Update / Create Button */}
        </div>
      </div>
    </div>
  );
}
