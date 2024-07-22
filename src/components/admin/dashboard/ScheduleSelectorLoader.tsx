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
import { Check, Info, RefreshCw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface IScheduleSelector {
  organizedScheduleData: TOrganizedData | null;
  packages: Exclude<TgetPackageScheduleDatas, null>;
}

const ScheduleSelectorLoader = () => {
  return (
    <>
        
          <div className="flex mb-4 gap-2 flex-wrap">
            <div className="flex items-center gap-2 ">
              <RefreshCw className="h-4  w-4" />
              <p className="text-xs text-muted-foreground">
                Update Existing Schedule
              </p>
            </div>
            <div className="flex items-center gap-2 ">
              <Check className="h-4  w-4" />
              <p className="text-xs text-muted-foreground">
                Create New Schedule
              </p>
            </div>
          </div>
          <div className="flex flex-col w-full gap-2">
            <div>
              <Label className="text-lg">Breakfast</Label>
              <div className="flex justify-between gap-2">
                <div className="w-full flex flex-col gap-2">
                  <Skeleton className="max-w-[300px] w-full h-9" />
                </div>
                <button className="p-2 border rounded-xl hover:bg-secondary">
                  <RefreshCw className="h-5  w-5" />
                </button>
              </div>
            </div>
            <div>
              <Label className="text-lg">Lunch</Label>
              <div className="flex justify-between gap-2">
                <div className="w-full">
                  <Skeleton className="max-w-[300px] w-full h-9" />
                </div>
                <button className="p-2 border rounded-xl hover:bg-secondary">
                  <RefreshCw className="h-5  w-5" />
                </button>
              </div>
            </div>
            <div>
              <Label className="text-lg">Dinner</Label>
              <div className="flex justify-between gap-2">
                <div className="w-full">
                  <Skeleton className="max-w-[300px] w-full h-9" />
                </div>
                <button className="p-2 border rounded-xl hover:bg-secondary">
                  <RefreshCw className="h-5  w-5" />
                </button>
              </div>
            </div>
          </div>

        {/* @TODO - [AMJAD / MUAD] : add in a footer to block / Maintance to all the schedule date   */}
        <CardFooter className="block">
          <div className="flex gap-2">
            <Button disabled={true} className="w-full flex justify-between items-center">
              <div />
              <p>Confirm Changes and submit all</p>
              <div className="">
                <Skeleton className="max-w-[300px] w-full h-9" />
              </div>
            </Button>
            <Popover>
              <PopoverTrigger className=" ">
                <Info />
              </PopoverTrigger>
              <PopoverContent align="end">
                <div>
                  This will Change Existing data and Change all schedule
                  according to the schedule set
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="mt-2">
            <Button disabled={true} className="w-full" variant={"destructive"}>
              Block{" "}
                {format(Date.now(), "dd-MM-y")}{" "}
              for Maintanance
              {/* Block This date  for Maintanance */}
            </Button>
          </div>
        </CardFooter>
        </>
     
  );
};

export default ScheduleSelectorLoader;
{
  /* <Skeleton className="max-w-[300px] w-full h-9" /> */
}
