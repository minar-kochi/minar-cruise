import "server-only";
import { db } from "@/db";
import { Image, PackageImage } from "@prisma/client";
import { notFound } from "next/navigation";
import { ErrorLogger } from "@/lib/helpers/PrismaErrorHandler";

export async function getPackageImages({
  packageId,
}: {
  packageId: string;
}): Promise<null> {
  return null;
  // try {
  // const data = await db.packageImage.findMany({
  //   where: {
  //     packageId: packageId,
  //   },
  //   select: {
  //     package: {
  //       select: {
  //         title: true,
  //       },
  //     },
  //     image: {
  //       select: {
  //         url: true,
  //         alt: true,
  //         id: true,
  //       },
  //     },
  //   },
  // });

  //   if (!data.length) {
  //     return null;
  //   }
  //   return data;
  // } catch (error) {
  //   ErrorLogger(error);
  //   return null;
  // }
}

// export async function getManyGenericImages({
//   type,
//   id,
// }: {
//   id: string;
//   type: "packageId";
// }): Promise<Image[] | null> {
//   try {
//     const data = await db.image.findMany({
//       where: {
//         [type]: id,
//       },
//     });
//     if (!data.length) {
//       return null;
//     }
//     return data;
//   } catch (error) {
//     ErrorLogger(error);
//     return null;
//   }
// }
