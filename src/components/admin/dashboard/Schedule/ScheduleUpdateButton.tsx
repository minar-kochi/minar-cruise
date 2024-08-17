import { Loader2, RefreshCw } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import CustomListDisk from "@/components/elements/CustomListDisk";
import { TScheduleSelector } from "@/Types/type";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { UpdatedDateScheduleSchema } from "@/lib/validators/ScheduleValidtor";
import { isStatusCustom } from "@/lib/validators/Schedules";
import { RemoveTimeStampFromDate, sleep, splitTimeColon } from "@/lib/utils";
import { isPackageStatusExclusive } from "@/lib/validators/Package";
import { setSyncDatabaseUpdatesScheduleCreation } from "@/lib/features/schedule/ScheduleSlice";
export default function ScheduleUpdateButton({ type }: TScheduleSelector) {
  const [isOpen, setIsOpen] = useState(false);
  const date = useAppSelector((state) => state.schedule.date);

  const updatedScheduleDatas = useAppSelector(
    (state) => state.schedule.updatedDateSchedule,
  );
  const { invalidate } = trpc.useUtils().admin.schedule.getSchedulesByDateOrNow;

  const { invalidate: InvalidateScheduleInfinity } =
    trpc.useUtils().admin.schedule.getSchedulesInfinity;
  const dispatch = useAppDispatch();

  const { mutate: updateSchedule } = trpc.admin.schedule.updateSchedule.useMutation({
    async onMutate(variables) {
      toast.loading(
        `Updating Schedule at ${format(variables.date, "do 'of' LLL")}`,
        { duration: 3000 },
      );
      setIsOpen(false);
    },
    async onSuccess(data, variables, context) {
      toast.dismiss();
      await InvalidateScheduleInfinity(undefined, {
        type: "all",
      });
      await invalidate({
        ScheduleDate: RemoveTimeStampFromDate(new Date(data.day)),
      });
      dispatch(setSyncDatabaseUpdatesScheduleCreation(data, type));
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

    updateSchedule({
      date,
      scheduleTime: updatedScheduleData.scheduleTime,
      packageId: updatedScheduleData.packageId,
      fromTime: splitTimeColon(updatedScheduleData.fromTime ?? "") ?? undefined,
      toTime: splitTimeColon(updatedScheduleData.toTime ?? "") ?? undefined,
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
        disabled={!updatedScheduleDatas[type].packageId}
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
            {format(date, "dd-MM-yyyy")} before changing.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <p className="text-muted-foreground">
            Note: before Changing Schedules:
          </p>
          <div className="px-4 text-muted-foreground my-4">
            <ul className=" list-disc list-outside">
              <li>This will move all the existing booking to new schedule.</li>
              <li>This will change or update existing schedule packages.</li>
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
              Change Booking at {format(date, "dd/MM")}{" "}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
