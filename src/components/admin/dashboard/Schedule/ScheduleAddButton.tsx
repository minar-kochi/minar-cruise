import { trpc } from "@/app/_trpc/client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setSyncDatabaseUpdatesScheduleCreation } from "@/lib/features/schedule/ScheduleSlice";
import { cn, RemoveTimeStampFromDate, splitTimeColon } from "@/lib/utils";
import { isStatusCustom } from "@/lib/validators/ScheudulePackage";
import { TScheduleSelector } from "@/Types/type";
import { format } from "date-fns";
import { Check } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { SelectPackageById } from "@/lib/features/Package/selector";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";

export default function ScheduleAddButton({ type }: TScheduleSelector) {
  const { invalidate } = trpc.useUtils().admin.getSchedulesByDateOrNow;
  const { updatedDateSchedule, date, currentDateSchedule } = useAppSelector(
    (state) => state.schedule,
  );
  const PackageDetails = useAppSelector((state) =>
    SelectPackageById(state, updatedDateSchedule[type].packageId, type),
  );

  const dispatch = useAppDispatch();
  const { mutate: createNewSchedule, isPending: isLoading } =
    trpc.admin.createNewSchedule.useMutation({
      async onMutate(variables) {
        toast.loading(
          `Confirming Schedule at ${format(variables.ScheduleDate, "do 'of' LLL")}`,
          { duration: 3000 },
        );
      },
      async onSuccess(data) {
        toast.dismiss();
        if (data) {
          await invalidate({
            ScheduleDate: RemoveTimeStampFromDate(new Date(data.day)),
          });
          dispatch(setSyncDatabaseUpdatesScheduleCreation(data, type));
        }
        toast.success("Schedule set successfully ");
      },
      onError(error, variables, context) {
        toast.dismiss();
        // @TODO understand the mutation code and display the error message accordingly.
        if (error.message) {
          toast.error(error.message);
        }
      },
    });
  async function handleCreateSchedule(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    try {
      if (!updatedDateSchedule) {
        return toast.error("Package has not selected. Please select a package");
      }
      if (currentDateSchedule[type]?.packageId) {
        return toast.error(
          `Package is already been set for ${type}. Please try again.`,
        );
      }

      if (!updatedDateSchedule[type]?.packageId) {
        return toast.error(
          `Could not Found the package for ${type}. Please try again.`,
        );
      }

      if (!updatedDateSchedule[type]?.packageId) {
        return toast.error(
          `Could not Found the package for ${type}. Please try again.`,
        );
      }
      if (isStatusCustom(updatedDateSchedule[type].scheduleTime)) {
        if (
          !updatedDateSchedule[type].fromTime ||
          !updatedDateSchedule[type].toTime
        ) {
          return toast.error(
            `Please Select a Time for ${updatedDateSchedule[type].scheduleTime.toLocaleLowerCase()} Schedule and  try again.`,
          );
        }
      }

      createNewSchedule({
        packageId: updatedDateSchedule[type].packageId,
        ScheduleDate: date,
        ScheduleTime: updatedDateSchedule[type].scheduleTime,
        ScheduleDateTime: {
          fromTime:
            splitTimeColon(updatedDateSchedule[type].fromTime ?? "") ??
            undefined,
          toTime:
            splitTimeColon(updatedDateSchedule[type].toTime ?? "") ?? undefined,
        },
      });
    } catch (error) {
      console.log(error);
      return toast.error(`Something went wrong!. Please try again.`);
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          variant: "outline",
          className: "w-full gap-1",
        })}
      >
        <Check className="h-4 w-4" />
        <p>Create {type}</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Schedule</DialogTitle>
          <DialogDescription className="">
            Please verify the following details before creating a{" "}
            <span className="bg-muted text-white py-1 rounded-full font-medium px-2">
              {type}
            </span>{" "}
            schedule for{" "}
            <span className="inline-block bg-muted text-white  rounded-full font-medium px-2">
              {format(date, "dd-MM-yyyy")}
            </span>
            {true ? (
              <>
                {" "}
                from
                <span className="inline-block bg-muted text-white  rounded-full font-medium px-2 mx-0.5">
                  {" "}
                  {updatedDateSchedule[type].fromTime
                    ? `${updatedDateSchedule[type].fromTime}`
                    : null}
                </span>{" "}
                to
                <span className="inline-block bg-muted text-white  rounded-full font-medium px-2 mx-0.5">
                  {" "}
                  {updatedDateSchedule[type].toTime
                    ? `${updatedDateSchedule[type].toTime}`
                    : null}
                </span>
              </>
            ) : null}{" "}
            under the
            <span
              className={cn(
                "px-2 py-0.5 my-0.5 mx-1 bg-muted text-white  rounded-full font-medium inline-block ",
                {
                  "bg-destructive": !PackageDetails,
                },
              )}
            >
              {PackageDetails ? PackageDetails.title : "No Package Selected"}
            </span>
            plan.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="flex gap-1">
            <Button className="" variant={"ghost"}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateSchedule}
              disabled={!PackageDetails}
              variant={"secondary"}
              className={cn("text-green-400", {
                "text-red-500": !PackageDetails,
              })}
            >
              Confirm schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
  // return (
  //   <Button
  //     variant={"outline"}
  //     onClick={handleCreateSchedule}
  //     className="rounded-xl border p-2 w-full hover:bg-secondary"
  //   >
  //     {isLoading ? (
  //       <>
  //         <Loader2 className="h-5 w-5 animate-spin" />
  //       </>
  //     ) : (
  //       <>
  //         <Check className="h-5 w-5" /> Create {type}
  //       </>
  //     )}
  //   </Button>
  // );
}
