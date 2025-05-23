import ExcelJS from "exceljs";

export const HeaderFont = {
  name: "Calibri",
  size: 18,
  bold: true,
  // color: { argb: "FFFFFFFF" }, // White text
};
export const A4ExcelPageSetup: Partial<ExcelJS.AddWorksheetOptions> = {
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
//   views: [{ state: "frozen", ySplit: 2 }],
};

export const HeaderRowCellFill: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF0070C0" }, // Blue background
};

export const HeaderRowCellBorder: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

export const TableBodyFont: Partial<ExcelJS.Font> = {
  name: "Calibri",
  size: 13,
};
export const TableBodyAlignment: Partial<ExcelJS.Alignment> = {
  vertical: "middle",
  horizontal: "center",
  wrapText: true,
};
export const TableBodyBorder: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

export let ScheduleTableHeader: Partial<ExcelJS.Column>[] = [
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
    header: "Type",
    key: "type",
    width: 15,
    style: {
      alignment: {
        vertical: "middle",
        horizontal: "center",
      },
    },
  },
  {
    header: "Status",
    key: "status",
    width: 15,
    style: {
      alignment: {
        vertical: "middle",
        horizontal: "center",
      },
    },
  },
];
