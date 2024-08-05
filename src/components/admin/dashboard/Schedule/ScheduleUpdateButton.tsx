import { Loader2, RefreshCw } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/adminStore/reducer";
import CustomListDisk from "@/components/elements/CustomListDisk";
import { TScheduleSelector } from "@/Types/type";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { UpdatedDateScheduleSchema } from "@/lib/validators/ScheduleValidtor";
export default function ScheduleUpdateButton({ type }: TScheduleSelector) {
  const date = useAppSelector((state) => state.schedule.date);
  const updatedScheduleDatas = useAppSelector(
    (state) => state.schedule.updatedDateSchedule,
  );
  const { mutate: updateSchedule } = trpc.admin.updateSchedule.useMutation({
    onSuccess(data, variables, context) {
      toast.success(data.message);
    },
    onError(error, variables, context) {
      toast.error("Something went wrong!");
    },
  });

  function handleScheduleUpdate() {
    let updatedScheduleData = updatedScheduleDatas[type] ?? null;
    if (!updatedScheduleData) {
      toast.error("Dude Updates aren't registered.");
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
    let { data, success, error } =
      UpdatedDateScheduleSchema.safeParse(updatedScheduleData);
    if (!success || !data) {
      toast.error(
        "There was a mismatch in the data selected. Please try again.",
      );
      toast.error(error?.message ?? "something is not done corret");
      return;
    }
    updateSchedule({ schedule: data, date });
  }
  return (
    <Dialog>
      <DialogTrigger
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
        <div>
          <p className="text-muted-foreground">
            Note: before Changing Schedules:
          </p>
          <div>
            <CustomListDisk
              title={
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, repellat?"
              }
            />
          </div>
          <div className="flex gap-1">
            <Button className="" variant={"secondary"}>
              Cancel
            </Button>
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
