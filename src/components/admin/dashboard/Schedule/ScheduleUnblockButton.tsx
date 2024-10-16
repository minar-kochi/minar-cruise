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
import { setSyncDatabaseDeleteSchedule } from "@/lib/features/schedule/ScheduleSlice";
import { useRouter } from "next/navigation";

export default function ScheduleUnblockButton({
  type,
  scheduleId,
}: TScheduleSelector & { scheduleId: string }) {
  const [open, isOpen] = useState(false);
  const date = useAppSelector((state) => state.schedule.date);
  const { invalidate: InvalidateScheduleInfinity } =
    trpc.useUtils().admin.schedule.getSchedulesInfinity;
  const { invalidate } = trpc.useUtils().admin.schedule.getSchedulesByDateOrNow;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { isPending, mutate } =
    trpc.admin.schedule.unBlockScheduleById.useMutation({
      async onSuccess(data, variables, context) {
        // setSyncDatabaseDeleteSchedule
        try {
          await InvalidateScheduleInfinity(undefined, {
            type: "all",
          });
          await invalidate({
            ScheduleDate: RemoveTimeStampFromDate(new Date(data.day)),
          });
          dispatch(setSyncDatabaseDeleteSchedule(data, type));
          isOpen(false);
          router.refresh();
          toast.success("Schedule is blocked.");
        } catch (error) {
          toast.error(
            "something went wrong while updating the UI please refresh",
          );
        }
      },
      onError(error, variables, context) {
        toast.error(error.message);
      },
    });

  const handleUnblock = () => {
    mutate({
      scheduleId,
    });
  };
  return (
    <Dialog open={open} onOpenChange={isOpen}>
      <DialogTrigger
        className={buttonVariants({
          variant: "destructive",
          className: "w-full  gap-1",
        })}
      >
        <Ban className="h-4 w-4" />
        Unblock {type}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block Schedule</DialogTitle>
          <DialogDescription>
            Are you sure to Block Schedule at {format(date, "dd-MM-yyyy")}{" "}
            {type}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-1">
          <Button className="" variant={"secondary"}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={handleUnblock}
            variant={"destructive"}
          >
            Unblock {type} at {format(date, "dd/MM/yyyy")}{" "}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
