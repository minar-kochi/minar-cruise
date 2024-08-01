import { Loader2, RefreshCw } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/adminStore/reducer";
export default function ScheduleUpdateButton() {
  const date = useAppSelector((state) => state.schedule.date);
  return (
    <Dialog>
      <DialogTrigger className="rounded-xl border bg-destructive p-2">
        <RefreshCw className="h-5 w-5" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block Schedule</DialogTitle>
          <DialogDescription>
            Are you sure to Block Schedule at {format(date, "dd-MM-yyyy")}
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
