import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PackageSelect } from "@/db/data/dto/package";
// import { TOrganizedData } from "@/lib/helpers/organizedData";
import ScheduleSelect from "./ScheduleSelect";
import { Check, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ScheduleCreateSchema,
  TScheduleCreateSchema,
  TScheduleSchema,
} from "@/lib/validators/ScheduleValidtor";
import { format } from "date-fns";
import { trpc } from "@/app/_trpc/client";
import { MouseEvent, useState } from "react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { TOrganizedPackageData } from "@/Types/packages/package";
import { TOrganizedScheduleData } from "@/Types/Schedule/ScheduleSelect";
interface IScheduleSelector {
  organizedScheduleData: TOrganizedScheduleData | null;
  packages: Exclude<TOrganizedPackageData, null>;
  selectedDate: TScheduleSchema["ScheduleDate"];
}
export type THandleNewSchedule = {
  e: MouseEvent<HTMLButtonElement>;
  packageId: string | null;
  ScheduleDate: TScheduleSchema["ScheduleDate"];
  ScheduleTime: TScheduleCreateSchema["ScheduleTime"];
};

export type TselectDate = {
  breakfast?: string | null;
  lunch?: string | null;
  dinner?: string | null;
  custom?: string | null;
};

export default function ScheduleSelector({
  organizedScheduleData,
  packages,
  selectedDate,
}: IScheduleSelector) {
  const [selectedPackage, setSelectedPackageId] = useState<TselectDate | null>({
    breakfast: organizedScheduleData?.breakfast?.packageId,
    dinner: organizedScheduleData?.dinner?.packageId,
    lunch: organizedScheduleData?.lunch?.packageId,
    custom: organizedScheduleData?.custom?.packageId,
  });
  const { mutate: CreateNewSchedule } =
    trpc.admin.createNewSchedule.useMutation({
      onMutate(variables) {
        toast.loading("Checking schedule...", {
          duration: 600,
        });
      },
      onSuccess(data, variables, context) {
        toast.success("Schedule has been set");
      },
      onError(error, variables, context) {
        toast.error("Failed to set Schedule");
        toast.error(error.message);
      },
    });

  function handleNewSchedule({
    e,
    packageId,
    ScheduleDate,
    ScheduleTime,
  }: THandleNewSchedule) {
    e.preventDefault();
    toast(packageId);
    if (!packageId) {
      toast("Package id is not selected Please try again");
      return;
    }
    if (!ScheduleTime) {
      toast("Schedule period is missing.");
    }

    const { success, data } = ScheduleCreateSchema.pick({
      ScheduleDate: true,
    }).safeParse(ScheduleTime);
    if (!success) {
      return toast("Not relevent timing");
    }

    if (!ScheduleDate) {
      toast("Schedule day is not selected Please try again");
      return;
    }
    CreateNewSchedule({
      packageId,
      ScheduleDate,
      ScheduleTime,
    });
  }

  function isIdExclusive(Package: PackageSelect[], id: string | null) {
    if (!id) return null;

    const ExclusivePackage = Package.find(
      (item) => item.packageCategory === "EXCLUSIVE"
    );

    if (ExclusivePackage?.id === id) {
      return true;
    }

    return false;
  }

  return (
    <div className="">
      <div className="flex flex-col w-full gap-2">
        <div>
          <Label className="text-lg">Breakfast</Label>
          <div className="flex justify-between gap-2">
            <div className="w-full flex flex-col gap-2">
              <ScheduleSelect
                key={organizedScheduleData?.breakfast?.id}
                type="breakfast"
                setSelectedDate={setSelectedPackageId}
                selected={organizedScheduleData?.breakfast}
                packages={packages.breakfast}
              />
              {isIdExclusive(
                packages.breakfast,
                selectedPackage?.breakfast ?? ""
              ) ? (
                <>
                  <Input type="time" />
                </>
              ) : (
                ""
              )}
            </div>
            <div className="">
              {organizedScheduleData?.breakfast?.id ? (
                <button className="p-2  border-2 rounded-xl hover:bg-secondary">
                  <RefreshCw className="h-5  w-5" />
                </button>
              ) : (
                <button
                  onClick={(e) =>
                    handleNewSchedule({
                      e,
                      packageId: selectedPackage?.breakfast ?? "",
                      ScheduleDate: selectedDate,
                      ScheduleTime: "BREAKFAST",
                    })
                  }
                  className="p-2  border-2 rounded-xl hover:bg-secondary"
                >
                  <Check className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div>
          <Label className="text-lg">Lunch</Label>
          <div className="flex justify-between gap-2">
            <div className="w-full flex gap-2 flex-col">
              <ScheduleSelect
                type="lunch"
                setSelectedDate={setSelectedPackageId}
                key={organizedScheduleData?.lunch?.id}
                selected={organizedScheduleData?.lunch}
                packages={packages.Lunch}
              />
              {isIdExclusive(
                packages.BreakFast,
                selectedPackage?.breakfast ?? ""
              ) ? (
                <>
                  <Input type="time" />
                </>
              ) : (
                ""
              )}
            </div>
            <div>
              {organizedScheduleData?.lunch?.id ? (
                <button className="p-2 h-10 w-10 border rounded-xl hover:bg-secondary">
                  <RefreshCw className="h-5  w-5" />
                </button>
              ) : (
                <button
                  onClick={(e) =>
                    handleNewSchedule({
                      e,
                      packageId: selectedPackage?.lunch ?? "",
                      ScheduleDate: selectedDate,
                      ScheduleTime: "LUNCH",
                    })
                  }
                  className="p-2 border max-h-fit rounded-xl hover:bg-secondary"
                >
                  <Check className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
        3
        {/* <div>
          <Label className="text-lg">Custom</Label>
          {organizedScheduleData?.custom?.map((item) => {
            return (
              <div className="flex justify-between gap-2">
                <div className="w-full flex flex-col gap-2">
                  <ScheduleSelect
                    type="custom"
                    setSelectedDate={setSelectedPackageId}
                    key={item?.id}
                    selected={item}
                    packages={packages.Dinner}
                  />
                  {isIdExclusive(
                    packages.Dinner,
                    selectedPackage?.dinner ?? ""
                  ) ? (
                    <>
                      <Input type="time" />
                    </>
                  ) : (
                    ""
                  )}
                </div>{" "}
                <div>
                  {organizedScheduleData?.dinner?.id ? (
                    <button className="p-2 border rounded-xl hover:bg-secondary">
                      <RefreshCw className="h-5  w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) =>
                        handleNewSchedule({
                          e,
                          packageId: selectedPackage?.dinner ?? "",
                          ScheduleDate: selectedDate,
                          ScheduleTime: "DINNER",
                        })
                      }
                      className="p-2 border rounded-xl hover:bg-secondary"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}{" "}
                </div>
              </div>
            );
          })}
        </div> */}
      </div>
      {/* </CardContent> */}
      {/* @TODO - [AMJAD / MUAD] : add in a footer to block / Maintance to all the schedule date   */}
      <CardFooter className="mt-4 block  max-w-md w-full px-0">
        <div className="flex w-full gap-2">
          <Button className="w-full flex justify-between items-center">
            <div />
            <p>Confirm Changes and submit all</p>
            <div className=""></div>
          </Button>
          <Popover>
            <PopoverTrigger className=" ">
              <Info />
            </PopoverTrigger>
            <PopoverContent align="end">
              <div>
                This will Change Existing data and Change all schedule according
                to the schedule set
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="mt-2">
          <Button className="w-full" variant={"destructive"}>
            Block{" "}
            {selectedDate
              ? format(selectedDate, "dd-MM-y")
              : format(Date.now(), "dd-MM-y")}{" "}
            for Maintanance
            {/* Block This date  for Maintanance */}
          </Button>
        </div>
      </CardFooter>
      {/* </Card> */}
    </div>
  );
}
