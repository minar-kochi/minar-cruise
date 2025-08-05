import { AlignmentType, ImageRun, Paragraph, TextRun } from "docx";
import { createBorderForParagraph } from "./doc-utils";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? (process.env.DOMAIN_URL ?? "https://cochincruiseline.com")
    : "http://localhost:3000";

const qrImageUrl = `${baseUrl}/assets/documents/QR.png`;
const minarLogo = `${baseUrl}/assets/whatsapplogo.png`;

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
