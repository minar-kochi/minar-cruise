import {
  AlignmentType,
  ImageRun,
  Paragraph,
  ParagraphChild,
  Table,
  TableCell,
  TableRow,
  TextRun,
} from "docx";
import { createBorderForParagraph, RemoveTableBorder } from "./doc-utils";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? (process.env.DOMAIN_URL ?? "https://cochincruiseline.com")
    : "http://localhost:3000";

const qrImageUrl = `${baseUrl}/assets/documents/QR.png`;
const minarLogo = `${baseUrl}/assets/whatsapplogo.png`;
const boatLogo = `${baseUrl}/logo-small.png`;

async function getImageBuffer(imageUrl: string) {
  const image = await fetch(imageUrl);
  if (!image) {
    throw new Error("Failed to fetch image");
  }
  const imageArrayBuffer = await image.arrayBuffer();
  return imageArrayBuffer;
}

export const CreateQrCode = async () => {
  return new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [
      new ImageRun({
        type: "png",
        data: await (async () => {
          const imageBuffer = await getImageBuffer(qrImageUrl);
          return imageBuffer;
        })(),
        transformation: {
          width: 80,
          height: 80,
        },
        altText: {
          name: "Minar QR code",
        },
      }),
    ],
    // Add negative spacing to pull it up and overlap with title
    spacing: {
      before: -800, // Negative value to pull up (adjust as needed)
      after: 0,
    },
  });
};

export const CreateMinarImage = async () => {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    children: [
      new ImageRun({
        data: await getImageBuffer(minarLogo),
        transformation: {
          width: 80,
          height: 80,
        },
        type: "png",
      }),
    ],
    spacing: {
      before: -1400, // Negative value to pull up (adjust as needed)
      after: 0,
    },
  });
};

export const CreateMinarLogo = async () => {
  const CreateBoatLogo = await getImageBuffer(boatLogo);
  return new Paragraph({
    children: [
      new ImageRun({
        data: await CreateBoatLogo,
        transformation: {
          height: 30,
          width: 50,
        },
        type: "png",
      }),
    ],
    alignment: "center",
    // border: createBorderForParagraph()
  });
};

export const CreateMinarHeading = new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [
    new TextRun({
      text: "Minar Cruise E-Ticket",
      size: 40,
      bold: true,
      allCaps: true,
      font: "Times New Roman",
    }),
  ],
});

export const CreateRow = (name: string, value: string) => {
  return new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: name,
                size: 16,
                bold: true,
              }),
            ],
          }),
        ],
        width: {
          size: 30,
          type: "pct",
        },
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `:  ${value}`,
                size: 16,
                bold: true,
              }),
            ],
          }),
        ],
        width: {
          size: 70,
          type: "pct",
        },
      }),
    ],
  });
};

export const CreateTable = ({
  rows,
  columns,
  columnWidthRatio,
  showBorder = false,
}: {
  rows: number;
  columns: number;
  showBorder?: boolean;
  columnWidthRatio: number;
}) => {
  return new Table({
    rows: [
      ...Array.from({ length: rows }, () => {
        return new TableRow({
          children: [
            ...Array.from({ length: columns }).map((value, index) => {
              return new TableCell({
                children: [],
                width: {
                  size: (1 / columnWidthRatio) * 100,
                  type: "pct",
                },
              });
            }),
          ],
        });
      }),
    ],
    width: {
      size: 100,
      type: "pct",
    },
    // borders: showBorder ? {} : RemoveTableBorder,
  });
};

/**
 *
 * @param name first row child
 * @param value second row child
 * @returns New Table Row with two columns, which can be used inside a table `rows` array
 */

export const CreateBookingInformationRow = (
  name: string,
  value: string,
  width?: string[],
) => {
  return new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: name,
                size: 16,
                bold: true,
              }),
            ],
          }),
        ],
        width: {
          size: width?.length ? parseInt(width[0]) : 40,
          type: "pct",
        },
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${value}`,
                size: 16,
                bold: true,
              }),
            ],
          }),
        ],
        width: {
          size: width?.length ? parseInt(width[1]) :60,
          type: "pct",
        },
      }),
    ],
  });
};
