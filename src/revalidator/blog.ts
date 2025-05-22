import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function revalidateBlogs({
  id,
  blogSlug,
}: {
  id?: string;
  blogSlug?: string;
}) {
  if (blogSlug) {
    revalidatePath(`/blog/${blogSlug}`);
  }
  if (id) {
    revalidatePath(`/admin/blog/update/${id}`);
  }
  revalidatePath(`/admin/blog/view`);
  revalidatePath(`/admin/blog/view`, "page");
  revalidatePath(`/blog`);
  revalidatePath(`/blog`, "layout");
  revalidatePath(`/blog`, "page");
}
