"use client";
import { trpc } from "@/app/_trpc/client";
import { Ban } from "lucide-react";
import React, { useState } from "react";
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
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import { TScheduleSelector } from "@/Types/type";
import toast from "react-hot-toast";
import { RemoveTimeStampFromDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  setSyncDatabaseUpdatesScheduleDeletion,
} from "@/lib/features/schedule/ScheduleSlice";

export default function ScheduleDeleteButton({ type }: TScheduleSelector) {
  const [open, isOpen] = useState(false);

  const date = useAppSelector((state) => state.schedule.date);
  const schduleData = useAppSelector(
    (state) => state.schedule.currentDateSchedule,
  );

  const { invalidate: InvalidateScheduleInfinity } =
    trpc.useUtils().admin.schedule.getSchedulesInfinity;

  const { invalidate } = trpc.useUtils().admin.schedule.getSchedulesByDateOrNow;

  const dispatch = useAppDispatch();

  const router = useRouter();
  const { mutate, isPending } =
    trpc.admin.schedule.deleteScheduleById.useMutation({
      async onSuccess(data, variables, context) {
        await InvalidateScheduleInfinity(undefined, {
          type: "all",
        });
        await invalidate({
          ScheduleDate: RemoveTimeStampFromDate(new Date(data.day)),
        });
        dispatch(setSyncDatabaseUpdatesScheduleDeletion(data, type));
        isOpen(false);
        router.refresh();
        toast.success("Schedule is Deleted.");
      },
      onError(error, variables, context) {
        toast.error(error.message);
      },
    });

  const handleDeleteButton = () => {
    if (!schduleData[type]) {
      toast.error("Schedule not found to be deleted.");
      return;
    }
    if (!schduleData[type]?.id) {
      toast.error("Schedule not found to be deleted.");
      return;
    }
    mutate({
      scheduleId: schduleData[type].id,
    });
  };
  return (
    <Dialog open={open} onOpenChange={isOpen}>
      <DialogTrigger
        className={buttonVariants({
          variant: "destructive",
          className:
            "w-full my-2 gap-1 border-destructive border-2 text-destructive",
        })}
      >
        <Ban className="h-4 w-4 " />
        <p className="">Delete {type}</p>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Schedule</DialogTitle>
          <DialogDescription className="">
            Are you sure to Delete {type} Schedule at {format(date, "dd-MM-yyyy")}
            
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-1">
          <Button
            onClick={() => isOpen(false)}
            className=""
            variant={"secondary"}
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={handleDeleteButton}
            variant={"destructive"}
          >
            Delete Lunch at {format(date, "dd/MM")}{" "}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
