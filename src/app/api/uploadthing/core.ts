import { db } from "@/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const fileInputSchema = z.object({
  alt: z.string().nonempty("Alt tag is required"),
});

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "1MB" } })
    .input(fileInputSchema)
    .middleware(async ({ req, input }) => {
      /**
       * @TODO
       * Check Authentication for admin.
       *  */
      return { alt: input.alt };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdImage = await db.image.create({
        data: {
          // possible file key needs to be added.
          url: file.url,
          alt: metadata.alt,
          fileKey: file.key,
        },
      });
      return { imageId: createdImage.id };

      // Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
