import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  getManySchedulesAndTotalBookingCount,
  getSchedulesAndBookingByDate,
} from "@/db/data/dto/schedule/schedule";
import CustomBookingBadge from "@/components/custom/CustomBookingBadge";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import BookingScheduleTable from "./BookingSchedule";

interface IAllSchedules {
  className?: string;
}

export default async function AllSchedules({ className }: IAllSchedules) {
  // const schedules = await getManySchedulesAndTotalBookingCount();
  // if (!schedules?.length) return <>No schedules found</>;

  return (
    <div className="">
      <BookingScheduleTable />
    </div>
  );
}
