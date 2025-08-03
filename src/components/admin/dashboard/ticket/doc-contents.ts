import { ImageRun, Paragraph } from "docx";

const imageUrl = "/assets/documents/QR.png";

async function getImageBuffer() {
  const image = await fetch(imageUrl);
  const imageArrayBuffer = await image.arrayBuffer();
  return imageArrayBuffer;
}

// const imageBuffer = await (async () => await getImageBuffer())();

export const CreateQrCode = async () =>
  await new Paragraph({
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
    alignment: "right",
  });
