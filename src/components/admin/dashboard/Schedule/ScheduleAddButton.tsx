import { convertScheduleDataDateToDateString } from "@/lib/helpers/organizedData";
import { trpc } from "@/app/_trpc/client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setSyncDatabaseUpdatesScheduleCreation } from "@/lib/features/schedule/ScheduleSlice";
import { cn } from "@/lib/utils";
import { formatIstMinutes } from "@/lib/datetime";
import { scheduleTimeDraft } from "@/lib/features/schedule/selector";
import { isStatusCustom } from "@/lib/validators/Schedules";
import { TScheduleSelector } from "@/Types/type";
import { formatDayKey, parseIstDayKey } from "@/lib/datetime";
import { Check } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { SelectPackageById } from "@/lib/features/Package/selector";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import { ShouldPackageBeAvailableForPublicToSchedule } from "@/lib/validators/Package";

export default function ScheduleAddButton({ type }: TScheduleSelector) {
  const { invalidate } = trpc.useUtils().admin.schedule.getSchedulesByDateOrNow;
  const { updatedDateSchedule, date, currentDateSchedule } = useAppSelector(
    (state) => state.schedule,
  );
  const [isOpen, setIsOpen] = useState(false);
  const PackageDetails = useAppSelector((state) =>
    SelectPackageById(state, updatedDateSchedule[type].packageId, type),
  );
  const timer = useAppSelector((state) => scheduleTimeDraft(state, type));
  const { invalidate: InvalidateBookingScheduleInfinity } =
    trpc.useUtils().admin.booking.bookingScheduleInfinity;
  const { invalidate: InvalidateScheduleInfinity } =
    trpc.useUtils().admin.schedule.getSchedulesInfinity;
  const dispatch = useAppDispatch();

  const { mutate: createNewSchedule, isPending: isLoading } =
    trpc.admin.schedule.createNewSchedule.useMutation({
      async onMutate(variables) {
        toast.loading(
          `Confirming Schedule at ${formatDayKey(parseIstDayKey(variables.ScheduleDate), "dayOrdinalMonth")}`,
          { duration: 3000 },
        );
        setIsOpen(false);
      },
      async onSuccess(data) {
        toast.dismiss();
        if (data) {
          toast.success("Schedule set successfully ");
          await InvalidateScheduleInfinity(undefined, {
            type: "all",
          });
          await InvalidateBookingScheduleInfinity(undefined, {
            type: "all",
          });
          const keyed = convertScheduleDataDateToDateString(data);
          await invalidate({ ScheduleDate: keyed.day });
          dispatch(setSyncDatabaseUpdatesScheduleCreation(keyed, type));
        }
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

      const needsExplicitTime =
        PackageDetails?.packageCategory &&
        !ShouldPackageBeAvailableForPublicToSchedule(
          PackageDetails.packageCategory,
        );

      // `== null` not falsiness: 0 is midnight, a legal departure.
      if (
        needsExplicitTime &&
        (timer.startMinutes == null || timer.endMinutes == null)
      ) {
        return toast.error(
          `Please Select a 'from' and 'To' for ${type} Schedule and  try again.`,
        );
      }

      const sendOverride = needsExplicitTime || timer.source === "draft";

      createNewSchedule({
        packageId: updatedDateSchedule[type].packageId,
        ScheduleDate: date,
        ScheduleTime: updatedDateSchedule[type].scheduleTime,
        // See ScheduleUpdateButton: only a real draft, or a category that
        // requires explicit times, counts as an override.
        overrideStartMinutes: sendOverride ? timer.startMinutes : null,
        overrideEndMinutes: sendOverride ? timer.endMinutes : null,
      });
    } catch (error) {
      console.log(error);
      return toast.error(`Something went wrong!. Please try again.`);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
      }}
    >
      <DialogTrigger
        className={buttonVariants({
          variant: "confirm",
          className: "w-full  gap-1",
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
            <span className="bg-muted text-primary py-1 rounded-full font-medium px-2">
              {type}
            </span>{" "}
            schedule for{" "}
            <span className="inline-block bg-muted text-primary  rounded-full font-medium px-2">
              {formatDayKey(date, "date")}
            </span>
            {timer.startMinutes != null ? (
              <>
                {" "}
                from
                <span className="inline-block bg-muted text-primary  rounded-full font-medium px-2 mx-0.5">
                  {" "}
                  {formatIstMinutes(timer.startMinutes)}
                </span>{" "}
                to
                <span className="inline-block bg-muted text-primary  rounded-full font-medium px-2 mx-0.5">
                  {" "}
                  {timer.endMinutes != null
                    ? formatIstMinutes(timer.endMinutes)
                    : "—"}
                </span>
              </>
            ) : null}{" "}
            under the
            <span
              className={cn(
                "px-2 py-0.5 my-0.5 mx-1 bg-muted text-primary  rounded-full font-medium inline-block ",
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
            <DialogClose asChild>
              <Button className="" variant={"ghost"}>
                Cancel
              </Button>
            </DialogClose>
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
