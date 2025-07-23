import { MAX_BOAT_SEAT } from "@/constants/config/business";
import {
  TGetSchedulesByDateRangeExcludingNull,
  TGetSchedulesByDateRangeWithBookingCount,
} from "@/db/data/dto/schedule";
import { selectFromTimeAndToTimeFromScheduleOrPackages } from "@/lib/helpers/CommonBuisnessHelpers";
import { $Enums } from "@prisma/client";
import { format } from "date-fns";
import ExcelJS from "exceljs";

export type TScheduleWithBookingCount = (Omit<
  TGetSchedulesByDateRangeWithBookingCount[number],
  "day"
> & {
  day: string;
})[];

type TCreateExcelTable = {
  TableName: string;
  TableRowData: TScheduleWithBookingCount;
};

export async function createExcelSheetWithBookingCount({
  TableName,
  TableRowData,
}: TCreateExcelTable) {
  const workbook = new ExcelJS.Workbook();

  const table = workbook.addWorksheet(TableName, {
    pageSetup: {
      paperSize: 9,
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 5,
      fitToHeight: 5,
      margins: {
        bottom: 0.5,
        footer: 0.5,
        header: 0.5,
        left: 0.5,
        right: 0.5,
        top: 1.5,
      },
    },
  });

  table.columns = [
    {
      header: "Num",
      key: "num",
      width: 8,
      style: {
        alignment: {
          vertical: "middle",
          horizontal: "center",
        },
      },
    },
    {
      header: "Date",
      key: "date",
      width: 15,
      style: {
        alignment: {
          vertical: "middle",
          horizontal: "center",
        },
      },
    },
    {
      header: "Day",
      key: "day",
      width: 15,
      style: {
        alignment: {
          vertical: "middle",
          horizontal: "center",
        },
      },
    },
    {
      header: "Duration",
      key: "duration",
      width: 25,
      style: {
        alignment: {
          vertical: "middle",
          horizontal: "center",
        },
      },
    },
    {
      header: "Package Name",
      key: "package",
      width: 30,
      style: {
        alignment: {
          vertical: "middle",
          horizontal: "center",
        },
      },
    },
    {
      header: "Booked",
      key: "booked",
      width: 15,
      style: {
        alignment: {
          vertical: "middle",
          horizontal: "center",
        },
      },
    },
    {
      header: "Available",
      key: "available",
      width: 15,
      style: {
        alignment: {
          vertical: "middle",
          horizontal: "center",
        },
      },
    },
  ];
  // HEADER-------------------------------------------------------------------

  const headerRow = table.getRow(1);
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

  let currentDate = "";
  let currentDay = "";
  let dateStartRow = 2; // Row 1 is header
  let dateCount = 0;
  TableRowData.forEach((item, i) => {
    const rowIndex = i + 2;
    const { Booking, Package, day, fromTime, toTime } = item;
    const dateStr = format(day, "dd/ MM /yyyy");
    const dayStr = format(day, "EEEE");

    const data = selectFromTimeAndToTimeFromScheduleOrPackages({
      Packages: {
        packageFromTime: Package?.fromTime ?? "",
        packageToTime: Package?.toTime ?? "",
      },
      schedule: {
        scheduleFromTime: fromTime,
        scheduleToTime: toTime,
      },
    });
    const fromToTime = data.fromTime + " - " + data.toTime;

    table.addRow({
      num: i + 1,
      date: dateStr,
      day: dayStr,
      duration: fromToTime,
      package: Package?.title,
      booked: Booking,
      available: MAX_BOAT_SEAT - Booking,
    });

    // Styling the row
    const newRow = table.getRow(rowIndex);
    newRow.height = 25; // You can go 28 or 30 if needed
    newRow.eachCell((cell) => {
      cell.font = { name: "Calibri", size: 13 };
      cell.alignment = {
        vertical: "top",
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

    // Merging logic
    if (dateStr !== currentDate || i === TableRowData.length - 1) {
      if (dateCount > 1) {
        const endRow =
          i === TableRowData.length - 1 && dateStr === currentDate
            ? rowIndex
            : rowIndex - 1;
        table.mergeCells(`B${dateStartRow}:B${endRow}`);
        table.mergeCells(`C${dateStartRow}:C${endRow}`);
      }

      currentDate = dateStr;
      currentDay = dayStr;
      dateStartRow = rowIndex;
      dateCount = 1;
    } else {
      // Still same date
      dateCount++;
      // Remove duplicate values in date/day columns
      const row = table.getRow(rowIndex);
      row.getCell("date").value = "";
      row.getCell("day").value = "";
    }
  });

  // let prevDate = "";
  // let prevDay = "";
  // TableRowData.map((item, i) => {
  //   const { Booking, Package, day, fromTime, toTime } = item;
  //   let date = format(day, "dd/ MM /yyyy");
  //   let displayDate = date;

  //   // If this date is the same as previous, don't display it
  //   if (prevDate === date) {
  //     displayDate = "";
  //   }

  //   const dayOfWeek = format(day, "EEEE");
  //   let displayDay = dayOfWeek;
  //   if (prevDay === day) {
  //     displayDay = "";
  //   }
  //   const data = selectFromTimeAndToTimeFromScheduleOrPackages({
  //     Packages: {
  //       packageFromTime: Package?.fromTime ?? "",
  //       packageToTime: Package?.toTime ?? "",
  //     },
  //     schedule: {
  //       scheduleFromTime: fromTime,
  //       scheduleToTime: toTime,
  //     },
  //   });
  //   const fromToTime = data.fromTime + " - " + data.toTime;

  //   const newRow = table.addRow({
  //     num: i + 1,
  //     date: displayDate,
  //     day: displayDay,
  //     duration: fromToTime,
  //     package: Package?.title,
  //     booked: Booking,
  //     available: MAX_BOAT_SEAT - Booking,
  //   });
  //   newRow.eachCell((cell) => {
  //     cell.font = {
  //       name: "Calibri",
  //       size: 12,
  //     };

  //     cell.alignment = {
  //       vertical: "middle",
  //       horizontal: "center",
  //     };

  //     cell.border = {
  //       top: { style: "thin" },
  //       left: { style: "thin" },
  //       bottom: { style: "thin" },
  //       right: { style: "thin" },
  //     };
  //   });
  //   prevDate = date;
  //   prevDay = day;
  // });

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
