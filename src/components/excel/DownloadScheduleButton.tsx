"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import ExcelJS, { Workbook } from "exceljs";
import {
  TGetBookingsByScheduleId,
  TGetSchedulesByDateRange,
} from "@/db/data/dto/schedule";
import { TDateRange } from "../admin/dashboard/Schedule/scheduleTable/ScheduleDownloadButton";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { selectFromTimeAndToTimeFromScheduleOrPackages } from "@/lib/helpers/CommonBuisnessHelpers";
import {
  createExcelSheetWithoutBookingCount,
  TScheduleWithoutBookingCount,
} from "./createExcelSheetWithoutBookingCount";
import {
  createExcelSheetWithBookingCount,
  TScheduleWithBookingCount,
} from "./createExcelSheetWithBookingCount";

interface IDownloadScheduleTable {
  state: TDateRange;
  type: "scheduleWithBookingCount" | "scheduleWithoutBookingCount";
}

export default function DownloadScheduleTable({
  state,
  type,
}: IDownloadScheduleTable) {
  /**
   * @TODO
   * this download button should be hidden if table data is empty
   * pass the schedule date to this page so that we can display it on top of the excel sheet
   * */

  const { fetch } = trpc.useUtils().admin.schedule.getSchedulesByDateRange;
  async function handleDownload() {
    try {
      toast.loading("Fetching Schedule data");
      const scheduleData = await fetch({
        fromDate: state.from,
        toDate: state.to,
        type,
      });
      if (!scheduleData) {
        toast.dismiss();
        toast.error("Failed to fetch schedule data");
        return;
      }
      if (type === "scheduleWithoutBookingCount") {
        await createExcelSheetWithoutBookingCount({
          TableName: "Schedules",
          Schedules: scheduleData as TScheduleWithoutBookingCount,
        });
        return;
      }
      await createExcelSheetWithBookingCount({
        TableName: "Schedules",
        TableRowData: scheduleData as TScheduleWithBookingCount,
      });
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong");
      return null;
    } finally {
      toast.dismiss();
    }
  }

  return (
    <Button
      onClick={handleDownload}
      variant={"greenFlag"}
      className="text-white hover:bg-white hover:text-green-600 hover:border border-green-600"
    >
      Download
    </Button>
  );
}
