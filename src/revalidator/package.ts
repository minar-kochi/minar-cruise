import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function revalidateAllPackageImageUse() {
  const packageSlugs = await db.package.findMany({
    select: {
      slug: true,
    },
  });
  packageSlugs.map(async (item) => {
    revalidatePath(`/package/${item.slug}`);
  });
  revalidatePath(`/`, "layout");
  revalidatePath(`/`, "page");
}
