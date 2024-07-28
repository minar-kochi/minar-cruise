import { trpc } from "@/app/_trpc/client";
import { useScheduleStore } from "@/providers/admin/schedule-store-provider";
import { Ban, RefreshCw } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { TselectDate } from "./ScheduleSelector";
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

export default function ScheduleBlockButton() {
  const date = useScheduleStore((state) => state.date);
  return (
    <Dialog>
      <DialogTrigger className="p-2   bg-destructive border rounded-xl">
        <Ban className="h-5 w-5" />
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
