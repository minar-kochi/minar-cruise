import { TGetSchedulesByDateRangeExcludingNull } from "@/db/data/dto/schedule";
import { selectFromTimeAndToTimeFromScheduleOrPackages } from "@/lib/helpers/CommonBuisnessHelpers";
import { format } from "date-fns";
import ExcelJS from "exceljs";
import {
  A4ExcelPageSetup,
  HeaderFont,
  HeaderRowCellBorder,
  HeaderRowCellFill,
  ScheduleTableHeader,
  TableBodyAlignment,
  TableBodyBorder,
  TableBodyFont,
} from "./excelSheetUtils";
import { trpc } from "@/app/_trpc/client";

export type TScheduleWithoutBookingCount = (Omit<
  TGetSchedulesByDateRangeExcludingNull[number],
  "day"
> & {
  day: string;
})[];

type TCreateExcelTable = {
  TableName: string;
  Schedules: TScheduleWithoutBookingCount;
};

const ScheduleSheetConfig = {
  TitleRowIndex:1,
  TitleHeight:40,
  HeaderRowIndex: 2,
  HeaderHeight: 30,
  TableDataStartingIndex: 3,
  TableDataRowHeight: 25,
};

export async function createExcelSheetWithoutBookingCount({
  TableName,
  Schedules,
}: TCreateExcelTable) {
  const workbook = new ExcelJS.Workbook();
  const table = workbook.addWorksheet(TableName, A4ExcelPageSetup);

  table.columns = ScheduleTableHeader;

  const {
    HeaderRowIndex,
    HeaderHeight,
    TableDataStartingIndex,
    TableDataRowHeight,
    TitleRowIndex,
    TitleHeight
  } = ScheduleSheetConfig;
  
// TITLE ROW-------------------------------------------------------------------
const title = `Schedule Details List - ${format(new Date(Date.now()),'dd/MM/yyy')}`; // Format: DD/MM/YYYY
table.insertRow(TitleRowIndex, [title]); // Add title row

const titleRow = table.getRow(TitleRowIndex);
titleRow.height = TitleHeight;
titleRow.font = { name: "Noto Sans Display Black", size: 20, bold: true };
titleRow.alignment = { horizontal: "center", vertical: "middle" };

// Merge all header columns to create a single heading cell
table.mergeCells(1, 1, 1, table.columns.length);
// TITLE ROW-------------------------------------------------------------------

  // HEADER-------------------------------------------------------------------

  const headerRow = table.getRow(HeaderRowIndex);
  headerRow.font = HeaderFont;
  headerRow.height = HeaderHeight;

  headerRow.eachCell((cell) => {
    cell.fill = HeaderRowCellFill;
    cell.border = HeaderRowCellBorder;
  });

  // HEADER-------------------------------------------------------------------

  // TABLE BODY -------------------------------------------------------------------
  Schedules.map((schedule, i) => {
    const { Package, day, schedulePackage, scheduleStatus, fromTime, toTime } =
      schedule;
    const rowIndex = i + TableDataStartingIndex;
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
      type: schedulePackage,
      status: scheduleStatus,
    });

    // Styling the row
    const newRow = table.getRow(rowIndex);
    newRow.height = TableDataRowHeight; // You can go 28 or 30 if needed
    newRow.eachCell((cell) => {
      cell.font = TableBodyFont;
      cell.alignment = TableBodyAlignment;
      cell.border = TableBodyBorder;
    });
  });
  // TABLE BODY -------------------------------------------------------------------

  // BLOCKED SCHEDULE STYLING
  const statusColumn = table.getColumn(7);
  statusColumn.eachCell((cell) => {
    const cellAddress = table.getCell(cell.address);
    const cellValue = cellAddress.value;

    if (cellValue === "BLOCKED") {
      cellAddress.fill = {
        type: "pattern",
        pattern: "lightGray",
        fgColor: { argb: "FF0000" },
      };
    }
  });

  // Merge cells for the "date" and "day" columns with same value
  let currentMergeStart = ScheduleSheetConfig.TableDataStartingIndex;
  let previousDate = table.getCell(`B${currentMergeStart}`).value;

  for (
    let i = ScheduleSheetConfig.TableDataStartingIndex + 1;
    i <= table.rowCount;
    i++
  ) {
    const currentDate = table.getCell(`B${i}`).value;

    if (currentDate !== previousDate) {
      if (i - 1 > currentMergeStart) {
        // Merge the previous group of same dates
        table.mergeCells(`B${currentMergeStart}:B${i - 1}`);
        table.mergeCells(`C${currentMergeStart}:C${i - 1}`);
      }
      currentMergeStart = i;
      previousDate = currentDate;
    }
  }

  // Merge remaining rows if they end with same date
  if (currentMergeStart < table.rowCount) {
    table.mergeCells(`B${currentMergeStart}:B${table.rowCount}`);
    table.mergeCells(`C${currentMergeStart}:C${table.rowCount}`);
  }

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
