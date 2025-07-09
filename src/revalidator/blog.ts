import { BLOG_PAGINATION_QUERY_LIMIT } from "@/constants/config";
import { getPublishedBlogsCount } from "@/db/data/dto/blog";
import { revalidatePath } from "next/cache";

export async function revalidateAllBlogs() {
  const totalBlogs = await getPublishedBlogsCount();
  const lastPage = Math.ceil(totalBlogs / BLOG_PAGINATION_QUERY_LIMIT);

  // console.log(lastPage);

  Array.from({ length: lastPage }, (_, index) => {
    revalidatePath(`/blogs/${index + 1}`);
  });
}
export async function revalidateBlog({ slug }: { slug: string }) {
  revalidatePath(`/blog/${slug}`);
}
