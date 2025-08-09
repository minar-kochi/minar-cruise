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
  CreateRow,
  CreateTable,
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
                CreateRow("Booking Id", "123123123"),
                CreateRow("Contact Num", "9565412022"),
                CreateRow("Email Id", "example@gmail.com"),
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
                CreateRow("Booking Mode", "Online"),
                CreateRow("Booking Date", "04/07/25"),
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
  // alignment: "center",
  spacing:{
    after: 360
  }
  // border: createBorderForParagraph()
});

export const BookingInformationContent = new Table({
  borders: RemoveTableBorder,
  rows: [
    CreateBookingInformationRow("Departure Date", ": Monday 24/05/25",["20","80"]),
    CreateBookingInformationRow("Reporting Time", ": 11:00",["20","80"]),
    CreateBookingInformationRow("Departure Time", ": 11:30",["20","80"]),
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
                CreateBookingInformationRow(": Adult", " 2", ["12", "90"]),
                CreateBookingInformationRow(": Child", " 1", ["12", "90"]),
                CreateBookingInformationRow(": Infant", " 0", ["12", "90"]),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  width: {
    size: 100,
    type: "pct",
  },
});

export const BillingDetails = new Paragraph({
  children : [
    new TextRun({
      text: "Passenger charges"
    }),
    new TextRun({
      text: "Some other charges"
    }),
    new TextRun({
      text: "other charges"
    }),
  ],
  tabStops: [
    {position: TabStopPosition.MAX,type: "right"}
  ]
})