import {
  BorderStyle,
  Header,
  Paragraph,
  Tab,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import { CreateMinarHeading, CreateMinarImage, CreateQrCode } from "./minar-data";
import { RemoveTableBorder } from "./doc-utils";

export const HeaderSection = async () => {
  const CreateQrCodeImageRun = await CreateQrCode();
  const CreateMinarImageRun = await CreateMinarImage();

  return {
    default: new Header({
      children: [CreateMinarHeading, CreateQrCodeImageRun, CreateMinarImageRun],
    }),
  };
};

export const CreateRow = (name: string, value: string) => {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({
          children: [
            new TextRun({
              text: name,
              size: 16,
              bold: true
            })
          ]
        })],
        width: {
          size: 30,
          type: "pct",
        },
      }),
      new TableCell({
        children: [new Paragraph({
          children: [
            new TextRun({
              text: `:  ${value}`,
              size: 16,
              bold: true
            })
          ]
        })],
        width: {
          size: 70,
          type: "pct",
        },
      }),
    ],
  });
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
                CreateRow("Booking Id","123123123"),
                CreateRow("Contact Num","9565412022"),
                CreateRow("Email Id","example@gmail.com"),
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
                type: "pct"
              },
              rows:[
                CreateRow("Booking Mode","Online"),
                CreateRow("Booking Date","04/07/25"),
              ],
              borders: RemoveTableBorder,
            })            // your second table content goes here
          ],
        }),
      ],
    }),
  ],
});
