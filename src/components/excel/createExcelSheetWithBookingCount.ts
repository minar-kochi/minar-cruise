import { MAX_BOAT_SEAT } from "@/constants/config/business";
import { TGetSchedulesByDateRangeExcludingNull, TGetSchedulesByDateRangeWithBookingCount } from "@/db/data/dto/schedule";
import { selectFromTimeAndToTimeFromScheduleOrPackages } from "@/lib/helpers/CommonBuisnessHelpers";
import { $Enums } from "@prisma/client";
import { format } from "date-fns";
import ExcelJS from "exceljs";

export type TScheduleWithBookingCount = (Omit<TGetSchedulesByDateRangeWithBookingCount[number], "day"> & {
  day: string;
})[];

type TCreateExcelTable = {
  TableName: string;
  TableRowData: TScheduleWithBookingCount

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
      // margins: {
      //   bottom: 2,
      //   footer: 2,
      //   header: 2,
      //   left: 2,
      //   right: 2,
      //   top: 2
      // },
    },
  });

  
  
  table.columns = [
    { 
      header: "N0.",
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

  table.getRow(1).font = {
    name: "header",
    family: 1,
    size: 12,
    bold: true,
  };


  TableRowData.map((item, i) => {
    const { Booking, Package, day, fromTime, toTime} =
      item;
      
    const date = format(day, "dd/ MM /yyyy");
    const dayOfWeek = format(day, "EEEE");
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
    const fromToTime = data.fromTime + " - " + data.toTime
    
    table.addRow({
      num: i+1  ,
      date: date,
      day: dayOfWeek,
      duration: fromToTime ,
      package: Package?.title ,
      booked: Booking,
      available: MAX_BOAT_SEAT - Booking,
    });
  });

 
//   const statusColumn = await table.getColumn(7);
//   statusColumn.eachCell((cell)=> {
//     const cellAddress = table.getCell(cell.address)
//     const cellValue  = cellAddress.value;
    
//     if(cellValue === "BLOCKED"){
//       cellAddress.fill = {
//         type: "pattern",
//         pattern: "lightGray",
//         fgColor: {argb: "FF0000"} 
//       }
//     }
//   })


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
