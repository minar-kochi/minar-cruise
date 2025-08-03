import { AlignmentType, ImageRun, Paragraph, TextRun } from "docx";

const imageUrl = "/assets/documents/QR.png";

async function getImageBuffer() {
  const image = await fetch(imageUrl);
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
          const imageBuffer = await getImageBuffer();
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
