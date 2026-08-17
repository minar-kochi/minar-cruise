import { convertScheduleDataDateToDateString } from "@/lib/helpers/organizedData";
import { RefreshCw } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDayKey, parseIstDayKey } from "@/lib/datetime";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import { TScheduleSelector } from "@/Types/type";
import { SelectPackageById } from "@/lib/features/Package/selector";
import { ShouldPackageBeAvailableForPublicToSchedule } from "@/lib/validators/Package";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { setSyncDatabaseUpdatesScheduleCreation } from "@/lib/features/schedule/ScheduleSlice";
import {
  isScheduleInputsChanged,
  scheduleTimeDraft,
} from "@/lib/features/schedule/selector";
export default function ScheduleUpdateButton({ type }: TScheduleSelector) {
  const [isOpen, setIsOpen] = useState(false);
  const date = useAppSelector((state) => state.schedule.date);

  const updatedScheduleDatas = useAppSelector(
    (state) => state.schedule.updatedDateSchedule,
  );

  const isScheduleChanged = useAppSelector((state) =>
    isScheduleInputsChanged(state, type),
  );
  const timer = useAppSelector((state) => scheduleTimeDraft(state, type));
  const PackageDetails = useAppSelector((state) =>
    SelectPackageById(
      state,
      updatedScheduleDatas[type]?.packageId ?? undefined,
      type,
    ),
  );
  const { invalidate } = trpc.useUtils().admin.schedule.getSchedulesByDateOrNow;

  const { invalidate: InvalidateScheduleInfinity } =
    trpc.useUtils().admin.schedule.getSchedulesInfinity;
  const dispatch = useAppDispatch();

  const { mutate: updateSchedule } =
    trpc.admin.schedule.updateSchedule.useMutation({
      async onMutate(variables) {
        toast.loading(
          `Updating Schedule at ${formatDayKey(parseIstDayKey(variables.date), "dayOrdinalMonth")}`,
          { duration: 3000 },
        );
        setIsOpen(false);
      },
      async onSuccess(data, variables, context) {
        toast.dismiss();
        await InvalidateScheduleInfinity(undefined, {
          type: "all",
        });
        const keyed = convertScheduleDataDateToDateString(data);
        await invalidate({ ScheduleDate: keyed.day });
        dispatch(setSyncDatabaseUpdatesScheduleCreation(keyed, type));
      },
      onError(error, variables, context) {
        toast.dismiss();
        // @TODO understand the mutation code and display the error message accordingly.
        if (error.message) {
          toast.error(error.message);
        }
      },
    });

  async function handleScheduleUpdate() {
    let updatedScheduleData = updatedScheduleDatas[type] ?? null;

    if (!updatedScheduleData) {
      toast.error(
        "There aren't any changes detected. sorry, Please try again.",
      );
      return;
    }
    if (!updatedScheduleData.packageId) {
      toast.error("Please select a package to update.");
      return;
    }

    if (!updatedScheduleData.scheduleTime || !date) {
      toast.error("There was an error while reading date.");
      return;
    }

    // Send an override ONLY when there is genuinely one to send.
    //
    // The time inputs render for every package type, so `timer` is populated
    // even when the admin never touched them — it falls back to the saved
    // schedule, then to the package's own departure. Passing that back as an
    // override would mark every ordinary update `isTimeOverridden`, and would
    // pin the schedule to a time it should keep inheriting.
    //
    // A draft means the admin typed something. EXCLUSIVE/CUSTOM packages always
    // need explicit times, so those resend the saved value rather than null.
    const needsExplicitTime =
      !!PackageDetails?.packageCategory &&
      !ShouldPackageBeAvailableForPublicToSchedule(
        PackageDetails.packageCategory,
      );
    const sendOverride = needsExplicitTime || timer.source === "draft";

    updateSchedule({
      date,
      scheduleTime: updatedScheduleData.scheduleTime,
      packageId: updatedScheduleData.packageId,
      overrideStartMinutes: sendOverride ? timer.startMinutes : null,
      overrideEndMinutes: sendOverride ? timer.endMinutes : null,
    });
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
      }}
    >
      <DialogTrigger
        disabled={!isScheduleChanged.isAnyChanged}
        className={buttonVariants({
          variant: "secondary",
          className: "w-full gap-1",
        })}
      >
        <RefreshCw className="h-4 w-4" />
        <p>Update {type}</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Schedule</DialogTitle>
          <DialogDescription>
            Please make sure that you have already changed all the bookings at{" "}
            <span className="text-green-500">{formatDayKey(date, "date")}</span>{" "}
            incase of you are changing packages.
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm">
          <p className="text-muted-foreground">
            <span className="text-red-500 font-medium">Note&apos;s</span>
          </p>
          <div className="px-4 text-muted-foreground my-2 text-sm">
            <ul className=" list-disc list-outside">
              <li
                className={cn({
                  hidden: !isScheduleChanged.packageId,
                })}
              >
                Changing Package will Change all Existing booking related to
                this schedule.
              </li>
              <li
                className={cn({
                  hidden: !isScheduleChanged.isTimeChanged,
                })}
              >
                Changing Schedule time only change the timing. it won&apos;t
                update package. (feel free to change time.)
              </li>
            </ul>
          </div>
          <div className="flex gap-1">
            <DialogClose>
              <Button className="" variant={"secondary"}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => handleScheduleUpdate()}
              variant={"destructive"}
            >
              Change Booking at {formatDayKey(date, "dayMonth")}{" "}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
