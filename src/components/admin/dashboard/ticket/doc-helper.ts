import {
  AlignmentType,
  ImageRun,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
} from "docx";
import {
  createBorderForParagraph,
  DOCXcolors,
  RemoveTableBorder,
} from "./doc-utils";
import items from "razorpay/dist/types/items";

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
    // border: RemoveTableBorder
    // Add negative spacing to pull it up and overlap with title
    // spacing: {
    //   before: -800, // Negative value to pull up (adjust as needed)
    //   after: 0,
    // },
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
      })
      ],
      border: RemoveTableBorder
    // spacing: {
    //   before: -1400, // Negative value to pull up (adjust as needed)
    //   after: 0,
    // },
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

export const CreateTwoColumnRow = (name: string, value: string) => {
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
          size: width?.length ? parseInt(width[1]) : 60,
          type: "pct",
        },
      }),
    ],
  });
};

type BillingDatatype = {
  content: string;
  size?: number;
  bold?: boolean;
  width?: number;
  color?: string;
};

export const createTableRow = ({ items }: { items: BillingDatatype[] }) => {
  return new TableRow({
    children: [
      ...items.map((item) => {
        return new TableCell({
          margins: {
            top: 70,
            bottom: 70,
            left: 100,
            right: 100,
          },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: item.content,
                  size: item.size ?? 14,
                  bold: item.bold ?? false,
                }),
              ],
            }),
          ],
          width: {
            size: item.width ?? 1,
            type: "pct",
          },
          shading: {
            fill: item.color ?? undefined,
          },
        });
      }),
    ],
  });
};

export const AddSpacing = (spacing?: number) => {
  return new Paragraph({
    spacing: {
      after: spacing ?? 400, // 400 twentieths of a point (about 20pt)
    },
  });
};

export const TermsAndConditions: string[] = [
  "Outside food not allowed",
  "Boarding / Check In closes 30 minutes before Ferry Departure. No show of passengers / Vehicle for boarding will be treated as automatic cancellation and no refund shall be issued. Tickets of Passengers / vehicles reporting after check in time closes, shall be automatically cancelled and no refund shall be issued.z",
  "Current Booking closes 45 minutes before ferry departure.",
  "Passengers are requested to wear the wrist bands issued from ticket counters throughout the journey. Absence of wrist band shall attract a penalty of Rs. 500/-.",
  "Priority will be given to emergency services during Check in & Check Out.",
  "Truck Drivers are requested to ensure that they have valid driving license and that the truck is in good physical condition with valid registration, insurance and fitness certificate. Truck drivers are requested to produce Bilti / LR & Challan at Ticket counter. Boarding the ferry can be denied in the absence of any of the above documents.",
  "Smoking / Spitting / Chewing Tobacco on the Ferry and within Terminal premises is prohibited and punishable by law. Penalty Rs. 2,500/- shall be charged from defaulters.",
  "Carrying and Consumption of alcohol on the Ferry and within Terminal premises is strictly prohibited and is a punishable offence.",
  "All passengers are requested to cooperate for luggage / vehicle scanning.",
  "Misconduct with Security staff, Terminal Staff, Ferry Crew and Fellow passengers is punishable by law.",
  "Damage to the Ferry / Terminal property is punishable by law.",
  "Booking Cancellations are permitted up to one day (24 hours) prior to the scheduled departure date and time of travel.",
  "The Ferry Operator is indemnified from any loss to Owners belongings.",
  "Parking & Boarding/Deboarding at Owners risk.",
  "Carrying and consumption of banned substances is strictly prohibited on board the ferry for which you would be arrested and severely prosecute by police. Ferry Operators Indigo Seaways Private Limited sternly warn against carrying of such substances.",
  "Passengers are requested to carry a valid photo ID proof at the time of reporting to the terminal. Free tickets shall be applicable for children below 2 (two) years of age, subject to the presentation of valid age proof. If valid age proof is not presented, the full ticket fare shall be applicable.",
  "Right of Admission Reserved.",
];

export const ImportantNotes = [
  "Damage to any property of this Ferry viz. the Doors, Seats, TV, AC, life jackets etc are punishable and defaulters shall be charged accordingly. If the penalty charges are not paid suitable actions shall be initiated and defaulters shall not be allowed to deboard the Ferry/leave terminal premises.",
  "Important information: 'We wish to remind you that DG SEA CONNECT never asks for your personal banking and security details like password, CVV, OTP etc.'",
  "Note: This is computer generated ticket/invoice and does not require a signature/stamp. Please do not reply to this email. It has been sent from an email account that is not monitored.",
];

export const footerNote =
  "For any queries, please reach out us via mail on helpdesk@dgferry.com or contact our passenger support team on 9924441847 (Mon to Sat 9:30AM to 5:30PM)";
