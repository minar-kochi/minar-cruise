import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TgetPackageScheduleDatas } from "@/db/data/dto/package";
import { TOrganizedData } from "@/lib/helpers/organizedData";
import ScheduleSelect from "./ScheduleSelect";
import { Check, RefreshCw } from "lucide-react";

interface IScheduleSelector {
  organizedScheduleData: TOrganizedData | null;
  packages: Exclude<TgetPackageScheduleDatas, null>;
}

const ScheduleSelectorLoader = () => {
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Schedule&apos;s</CardTitle>
          <CardDescription>Update or add new schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col w-full gap-2">
            <div>
              <Label className="text-lg">Breakfast</Label>
              <div className="flex justify-between">
                {/* add Skeleton */}
                <Skeleton className="max-w-[300px] w-full h-9" />
                <button>
                  <Check />
                </button>
              </div>
            </div>
            <div>
              <Label className="text-lg">Lunch</Label>
              <div className="flex justify-between">
                {/* add Skeleton */}
                <Skeleton className="max-w-[300px] w-full h-9" />

                <button>
                  <Check />
                </button>
              </div>
            </div>
            <div>
              <Label className="text-lg">Dinner</Label>
              <div className="flex justify-between">
                {/* add Skeleton */}
                <Skeleton className="max-w-[300px] w-full h-9" />
                <button>
                  <Check />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default ScheduleSelectorLoader;
