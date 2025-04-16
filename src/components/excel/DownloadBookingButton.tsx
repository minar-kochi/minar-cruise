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
import ExcelJS from "exceljs";
import { TGetBookingsByScheduleId } from "@/db/data/dto/schedule";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface IDownloadTable {
  tableData: TGetBookingsByScheduleId;
  date?:string
}

export default function DownloadBookingButton({ tableData }: IDownloadTable) {
  /**
   * @TODO
   * this download button should be hidden if table data is empty
   * pass the schedule date to this page so that we can display it on top of the excel sheet
   * */

  function exportExcelFile() {
    const workbook = new ExcelJS.Workbook();

    const BookingTable = workbook.addWorksheet("Bookings", {
      pageSetup: {
        paperSize: 9,
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        margins: {
          bottom: 0.5,
          footer: 0.5,
          header: 0.5,
          left: 0.5,
          right: 0.5,
          top: 1.5,
        },
      },
       views: [{ state: 'frozen', ySplit: 2 }],
    });

    BookingTable.columns = [
      {
        header: "Num",
        key: "num",
        width: 12,
        style: {
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
        },
      },
      {
        header: "Name",
        key: "name",
        width: 20,
        style: {
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
        },
      },
      {
        header: "Date Of Booking",
        key: "bookingDate",
        width: 23,
        style: {
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
        },
      },
      {
        header: "Package",
        key: "package",
        width: 15,
        style: {
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
        },
      },
      {
        header: "Advance Paid",
        key: "advance",
        width: 20,
        style: {
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
        },
      },
      {
        header: "Total Bill",
        key: "totalAmount",
        width: 15,
        style: {
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
        },
      },
      {
        header: "Phone",
        key: "phone",
        width: 15,
        style: {
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
        },
      },
      {
        header: "Adults",
        key: "adult",
        width: 10,
        style: {
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
        },
      },
      {
        header: "Child",
        key: "child",
        width: 10,
        style: {
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
        },
      },
      {
        header: "Kid",
        key: "kids",
        width: 10,
        style: {
          alignment: {
            vertical: "middle",
            horizontal: "center",
          },
        },
      },
      {
        header: "Description",
        key: "description",
        width: 30,
        style: {
          alignment: {
            vertical: "justify",
            horizontal: "center",
          },
        },
      },
    ];

    if(!tableData?.length) {
      toast.error("Table data empty")
      return
    }

    // TITLE ROW-------------------------------------------------------------------
    const ScheduleDate = tableData[0].schedule.day
    const title = `Schedule Details - ${format(ScheduleDate,'dd/MM/yyy')}`; // Format: DD/MM/YYYY
    BookingTable.insertRow(1, [title]); // Add title row

    const titleRow = BookingTable.getRow(1);
    titleRow.height = 50;
    titleRow.font = { name: "Noto Sans Display Black", size: 20, bold: true };
    titleRow.alignment = { horizontal: "center", vertical: "middle" };

    // Merge all header columns to create a single heading cell
    BookingTable.mergeCells(1, 1, 1, BookingTable.columns.length);
    // TITLE ROW-------------------------------------------------------------------


    // HEADER-------------------------------------------------------------------
    const headerRow = BookingTable.getRow(2);
    headerRow.font = {
      name: "Calibri",
      size: 16,
      bold: true,
      // color: { argb: "FFFFFFFF" }, // White text
    };
    headerRow.height = 25;

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0070C0" }, // Blue background
      };

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // HEADER-------------------------------------------------------------------

    // Do something here when table data in empty
    tableData?.map((item, index) => {
      const {
        createdAt,
        description,
        id,
        numOfAdults,
        numOfBaby,
        numOfChildren,
        payment,
        schedule,
        user,
      } = item;
      BookingTable.addRow({
        num: index + 1,
        name: user.name,
        bookingDate: createdAt,
        package: schedule.schedulePackage,
        advance: payment.advancePaid,
        totalAmount: payment.totalAmount,
        phone: user.contact,
        adult: numOfAdults,
        child: numOfChildren,
        kids: numOfBaby,
        description: description,
      });

      const rowIndex = index + 3;

      // Styling the row
      const newRow = BookingTable.getRow(rowIndex);
      newRow.height = 25; // You can go 28 or 30 if needed
      newRow.eachCell((cell) => {
        cell.font = { name: "Calibri", size: 13 };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
      });
      const url = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "download.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  }
  return (
    <Button variant={"default"} onClick={exportExcelFile}>
      Download
    </Button>
  );
}

// <DropdownMenu>
//   <DropdownMenuTrigger asChild>
//     <Button variant="outline">Open</Button>
//   </DropdownMenuTrigger>
//   <DropdownMenuContent className="w-36">
//     <DropdownMenuItem>
//       <LogOut className="mr-2 h-4 w-4" />
//       <span>Log out</span>
//       <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
//     </DropdownMenuItem>
//   </DropdownMenuContent>
// </DropdownMenu>
