import { trpc } from "@/app/_trpc/client";
import { Ban } from "lucide-react";
import React from "react";
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
import { TScheduleSelector } from "@/Types/type";

export default function ScheduleUnblockButton({ type }: TScheduleSelector) {
  const date = useAppSelector((state) => state.schedule.date);
  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({
          variant: "destructive",
          className: "w-full mt-2 gap-1",
        })}
      >
        <Ban className="h-4 w-4" />
        UnBlock {type}
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
          <Button variant={"destructive"}>
            Block Lunch at {format(date, "dd/MM")}{" "}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
