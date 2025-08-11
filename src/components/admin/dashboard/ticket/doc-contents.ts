import {
  BorderStyle,
  Header,
  Paragraph,
  Tab,
  Table,
  TableCell,
  TableRow,
  TabStopPosition,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import {
  CreateBookingInformationRow,
  CreateMinarHeading,
  CreateMinarImage,
  CreateMinarLogo,
  CreateQrCode,
  CreateTable,
  createTableRow,
  CreateTwoColumnRow,
} from "./doc-helper";
import {
  createBorderForParagraph,
  createTextRunBorder,
  DOCXcolors,
  RemoveTableBorder,
} from "./doc-utils";

export const HeaderSection = async () => {
  const CreateQrCodeImageRun = await CreateQrCode();
  const CreateMinarImageRun = await CreateMinarImage();
  return {
    default: new Header({
      children: [CreateMinarHeading, CreateQrCodeImageRun, CreateMinarImageRun],
    }),
  };
};

export const BookingInformation = new Table({
  width: {
    size: 100,
    type: WidthType.PERCENTAGE,
  },
  borders: RemoveTableBorder,
  rows: [
    new TableRow({
      children: [
        // Left column
        new TableCell({
          width: {
            size: 50,
            type: WidthType.PERCENTAGE,
          },
          verticalAlign: VerticalAlign.TOP,

          // margins: {
          //   right: 200, // Add some spacing between columns
          // },
          children: [
            // your table content goes here
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                CreateTwoColumnRow("Booking Id", "123123123"),
                CreateTwoColumnRow("Contact Num", "9565412022"),
                CreateTwoColumnRow("Email Id", "example@gmail.com"),
              ],
              borders: RemoveTableBorder,
            }),
          ],
        }),

        // Right column
        new TableCell({
          width: {
            size: 50,
            type: WidthType.PERCENTAGE,
          },
          verticalAlign: VerticalAlign.TOP,

          // margins: {
          //   left: 200, // Add some spacing between columns
          // },
          children: [
            new Table({
              width: {
                size: 100,
                type: "pct",
              },
              rows: [
                CreateTwoColumnRow("Booking Mode", "Online"),
                CreateTwoColumnRow("Booking Date", "04/07/25"),
              ],
              borders: RemoveTableBorder,
            }), // your second table content goes here
          ],
        }),
      ],
    }),
  ],
});

export const BoardingAndPackageInformation = async () => {
  const CreateLogoImageRun = await CreateMinarLogo();

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    margins: {
      top: 480,
      bottom: 480,
    },
    borders: RemoveTableBorder,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 40,
              type: "pct",
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Booking Package",
                    size: 22,
                    bold: true,
                  }),
                ],
                alignment: "center",
                // spacing: {
                //   before: 240,
                // },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Sunset cruise`,
                    size: 22,
                  }),
                ],
                alignment: "center",
              }),
            ],
          }),
          new TableCell({
            width: {
              size: 20,
              type: "pct",
            },
            children: [CreateLogoImageRun],
            verticalAlign: "center",
          }),
          new TableCell({
            width: {
              size: 40,
              type: "pct",
            },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Boarding Time",
                    size: 22,
                    bold: true,
                  }),
                ],
                alignment: "center",
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "12:50",
                    size: 22,
                  }),
                ],
                alignment: "center",
              }),
            ],
          }),
        ],
      }),
    ],
  });
};

export const BookingInformationHeading = new Paragraph({
  children: [
    new TextRun({
      text: "Booking Information",
      size: 28,
      bold: true,
      underline: {
        color: DOCXcolors.black,
        type: "single",
      },
      // border: createTextRunBorder(),
    }),
  ],
  alignment: "center",
  spacing: {
    after: 360,
  },
  // border: createBorderForParagraph()
});

export const BookingInformationContent = new Table({
  borders: RemoveTableBorder,
  alignment: "center",
  rows: [
    CreateBookingInformationRow("Departure Date", ": Monday 24/05/25", [
      "50",
      "50",
    ]),
    CreateBookingInformationRow("Reporting Time", ": 11:00", ["50", "50"]),
    CreateBookingInformationRow("Departure Time", ": 11:30", ["50", "50"]),
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Passengers",
                  size: 16,
                  bold: true,
                }),
              ],
              tabStops: [{ position: 10, type: "center" }],
            }),
          ],
        }),
        new TableCell({
          children: [
            new Table({
              borders: RemoveTableBorder,
              width: {
                size: 100,
                type: "pct",
              },
              rows: [
                CreateBookingInformationRow(": Adult", " 2", ["40", "60"]),
                CreateBookingInformationRow(": Child", " 1", ["40", "60"]),
                CreateBookingInformationRow(": Infant", " 0", ["40", "60"]),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  width: {
    size: 50,
    type: "pct",
  },
});

export const BillingDetails = new Table({
  rows: [
    createTableRow({
      items: [
        { content: "Passenger Charges in INR" },
        { bold: true, content: " 400.00" },
        { content: "Vehicle Charges in INR" },
        { bold: true, content: " 0.00" },
      ],
    }),
    createTableRow({
      items: [
        { content: "Additional Charges in INR" },
        { bold: true, content: " 0.00" },
        { content: "Total Fare in INR" },
        { bold: true, content: " 400.00" },
      ],
    }),
  ],
  // alignment: "left",
  width: {
    size: 100,
    type: "pct",
  },
});

export const PassengerDetails = new Table({
  rows: [
    createTableRow({
      items: [
        { color: DOCXcolors.gray,bold: true, size: 16, content: "Sr.No" },
        { color: DOCXcolors.gray,bold: true, size: 16, content: "First Name" },
        { color: DOCXcolors.gray,bold: true, size: 16, content: "Last Name" },
        { color: DOCXcolors.gray,bold: true, size: 16, content: "Age / Gender" },
        { color: DOCXcolors.gray,bold: true, size: 16, content: "Seat No." },
        { color: DOCXcolors.gray,bold: true, size: 16, content: "Status" },
      ],
    }),
    createTableRow({
      items: [
        { size: 14, content: "1" },
        { size: 14, content: "Muhammed Aslam" },
        { size: 14, content: "CK" },
        { size: 14, content: "27 / Male" },
        { size: 14, content: "EB103" },
        { size: 14, content: "Confirmed" },
      ],
    }),
    createTableRow({
      items: [
        { size: 14, content: "2" },
        { size: 14, content: "Muhammed Aslam" },
        { size: 14, content: "CK" },
        { size: 14, content: "27 / Male" },
        { size: 14, content: "EB103" },
        { size: 14, content: "Confirmed" },
      ],
    }),
    createTableRow({
      items: [
        { size: 14, content: "3" },
        { size: 14, content: "Muhammed Aslam" },
        { size: 14, content: "CK" },
        { size: 14, content: "27 / Male" },
        { size: 14, content: "EB103" },
        { size: 14, content: "Confirmed" },
      ],
    }),
  ],
});
