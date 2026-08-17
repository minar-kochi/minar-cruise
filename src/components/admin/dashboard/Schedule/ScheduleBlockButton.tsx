"use client";
import { convertScheduleDataDateToDateString } from "@/lib/helpers/organizedData";
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
import { formatDayKey } from "@/lib/datetime";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/adminStore/reducer";
import { TScheduleSelector } from "@/Types/type";
import toast from "react-hot-toast";
import { selectedPackageIdsAndScheduleMapToEnum } from "@/Types/Schedule/ScheduleSelect";
import { useRouter } from "next/navigation";
import { setSyncDatabaseUpdatesScheduleCreation } from "@/lib/features/schedule/ScheduleSlice";

export default function ScheduleBlockButton({ type }: TScheduleSelector) {
  const [open, isOpen] = useState(false);
  const date = useAppSelector((state) => state.schedule.date);
  const { invalidate: InvalidateScheduleInfinity } =
    trpc.useUtils().admin.schedule.getSchedulesInfinity;
  const { invalidate } = trpc.useUtils().admin.schedule.getSchedulesByDateOrNow;
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { mutate, isPending } =
    trpc.admin.schedule.blockScheduleByDateAndStatus.useMutation({
      async onSuccess(data, variables, context) {
        await InvalidateScheduleInfinity(undefined, {
          type: "all",
        });
        const keyed = convertScheduleDataDateToDateString(data);
        await invalidate({ ScheduleDate: keyed.day });
        dispatch(setSyncDatabaseUpdatesScheduleCreation(keyed, type));

        isOpen(false);
        router.refresh();
        toast.success("Schedule is blocked.");
      },
      onError(error, variables, context) {
        toast.error(error.message);
      },
    });

  const handleBlockButton = () => {
    const ScheduleTime = selectedPackageIdsAndScheduleMapToEnum[type];
    if (!ScheduleTime) {
      toast.error("Failed to get Schedule Time.");
      return;
    }
    mutate({
      date,
      ScheduleTime,
    });
  };
  return (
    <Dialog open={open} onOpenChange={isOpen}>
      <DialogTrigger
        className={buttonVariants({
          variant: "outline",
          className:
            "w-full  gap-1 border-destructive border-2 text-destructive",
        })}
      >
        <Ban className="h-4 w-4 text-red-600" />
        <p className="text-red-600">Block {type}</p>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block Schedule</DialogTitle>
          <DialogDescription>
            Are you sure to Block Schedule at {formatDayKey(date, "date")}{" "}
            {type}
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
            onClick={handleBlockButton}
            variant={"destructive"}
          >
            Block {type} at {formatDayKey(date, "dayMonth")}{" "}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
