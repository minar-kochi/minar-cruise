import { ImageRun, Paragraph, TextRun } from "docx";

const imageUrl = "/assets/documents/QR.png";
async function getImageBuffer() {
  const image = await fetch(imageUrl);
  const imageArrayBuffer = await image.arrayBuffer();
  return imageArrayBuffer;
}

const imageBuffer = await (async () => await getImageBuffer())();

export const QrCode = new Paragraph({
  children: [
    new ImageRun({
      type: "png",
      data: imageBuffer,
      transformation: {
        width: 80,
        height: 80,
      },
      altText: {
        name: "Minar QR code",
      },
    }),
    new TextRun("yo yo"),
  ],
  alignment: "right",
  //   border: this.createBorder(),
});
