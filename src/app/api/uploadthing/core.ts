import { db } from "@/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "1MB" } })
    // .middleware(async ({ req }) => {
    //   return {};
    // })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image Successfully Uploaded!", metadata);
      console.log("file url", file.url);

      const imageId = metadata;
      const res = await fetch(file.url);

      const createdImage = await db.image.create({
        data: {
          url: file.url,
          alt: file.name,
        },
      });
      return { imageId: createdImage.id };

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata };
    }),
} satisfies FileRouter;


 {/* add input for alt tag */}

export type OurFileRouter = typeof ourFileRouter;
