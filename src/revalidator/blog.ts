import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function revalidateUniqueBlog({
  id,
  blogSlug,
}: {
  id?: string;
  blogSlug?: string;
}) {
  if (blogSlug) {
    revalidatePath(`/blog/${blogSlug}`);
    revalidatePath(`/blog`, "layout");
    revalidatePath(`/blog`, "page");
  }
  if (id) {
    revalidatePath(`/admin/blog/update/${id}`);
    revalidatePath(`/admin/blog/update`, "page");
  }
}

export async function revalidateAllBlogs() {
  revalidatePath(`/admin/blog/view`);
  revalidatePath(`/admin/blog/view`, "page");
  revalidatePath(`/blog`);
  revalidatePath(`/blog`, "layout");
  revalidatePath(`/blog`, "page");
}
