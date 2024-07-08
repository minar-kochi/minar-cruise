import { db } from "@/db";

export async function handleSubmit({
  alt,
  packageId,
  url,
}: {
  url: string;
  alt: string;
  packageId: string;
}) {
  try {
    await db.image.create({
      data: {
        alt,
        url,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
