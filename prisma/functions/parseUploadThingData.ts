import { Image } from "@prisma/client";
import { UploadThingData } from "../data/UploadThingImageData";
type TUploadThingDataType = (typeof UploadThingData)[number];
type TImageSchema = Omit<Image, "id">;
const IMAGE_EXTENTIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".svg",
];
export async function checkUploadThingFile() {
  const data = await fetch(UploadThingData[0].url);
  if (!data) {
    throw Error(
      "Can you ensure the file exists? Because I couldn't Ping to the first file.",
    );
  }
}

export async function parseUploadThingData() {
  const data: TImageSchema[] = [];
  UploadThingData.forEach((item) => {
    let name = handleFileName(item.name);
    if (!name.isImage) {
      return;
    }
    data.push({
      alt: name.name,
      fileKey: item.key,
      ImageUse: ["COMMON"],
      updatedAt: new Date(Date.now()),
      createdAt: new Date(Date.now()),
      url: item.url,
    });
  });
  return data;
}

function handleFileName(fileName: string): { name: string; isImage: boolean } {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return { name: fileName, isImage: false };
  }

  const extension = fileName.slice(lastDotIndex).toLowerCase();
  const nameWithoutExtension = fileName.slice(0, lastDotIndex);

  const isImage = IMAGE_EXTENTIONS.includes(extension);

  return {
    name: isImage ? nameWithoutExtension : fileName,
    isImage: isImage,
  };
}
