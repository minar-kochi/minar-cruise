import React, { Dispatch, SetStateAction } from "react";
import ScheduleSelect from "./Schedule/ScheduleSelect";
import { TOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
import { PackageSelect, TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TScheduleSchema } from "@/lib/validators/ScheduleValidtor";
import { Label } from "@/components/ui/label";
import { isIdExclusive } from "@/lib/helpers/ExclusivePackage";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { TScheduleDayReplaceString } from "@/Types/type";
import { TselectDate } from "./ScheduleSelector";

interface IScheduleSelector {
  //   organizedScheduleData: TOrganizedScheduleData | null;
  id?: string | null;
  packages: PackageSelect[];
  label: string;
  type: keyof TselectDate;
  selected: TScheduleDayReplaceString | null | undefined;
  //   selectedDate: TScheduleSchema["ScheduleDate"];
  setSelectedPackageId: Dispatch<SetStateAction<TselectDate | null>>;
}

export default function ScheduleSelectorDynamic({
  id,
  packages,
  label,
  selected,
  type,
  setSelectedPackageId,
}: IScheduleSelector) {
  console.log(selected);
  return (
    <div className="w-full ">
      <Label className="text-lg">{label}</Label>
      <div className="flex w-full  justify-between gap-2">
        <div className="w-full flex flex-col gap-2">
          <ScheduleSelect
            key={`ScheduleSelect-${Math.random()}`}
            selected={selected}
            type={type}
            setSelectedPackageId={setSelectedPackageId}
            packages={packages}
          />
          <div>
            {isIdExclusive(packages, id ?? "null") ? (
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
