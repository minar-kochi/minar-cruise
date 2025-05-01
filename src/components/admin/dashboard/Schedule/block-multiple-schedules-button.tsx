import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BlockMultipleSchedulesCalender from "./scheduleTable/block-multiple-schedules-calender";

export default function BlockMultipleSchedulesButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Block Multiple Schedules</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-max" aria-describedby="block-multiple-schedule-days">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Please select date-range
          </DialogTitle>
        </DialogHeader>
        <BlockMultipleSchedulesCalender />
      </DialogContent>
    </Dialog>
  );
}
