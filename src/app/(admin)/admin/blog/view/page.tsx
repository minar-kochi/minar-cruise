import BlogTable from "@/components/blog/blog-table";
import { BLOG_INFINITE_QUERY_LIMIT } from "@/constants/config";
import { getBlogsListDTO } from "@/db/data/dto/blog";
import { TBlogsInfinityQueryPropsValidation } from "@/lib/validators/blogs";

export default async function page() {
  const data = await getBlogsListDTO({ limit: BLOG_INFINITE_QUERY_LIMIT });
  let nextCursor: TBlogsInfinityQueryPropsValidation["cursor"] | undefined =
    undefined;

  if (data && data.length > BLOG_INFINITE_QUERY_LIMIT) {
    const nextItem = data.pop();
    nextCursor = nextItem?.id;
  }

  const initialData = {
    blogs: data,
    nextCursor,
  };

  return (
    <div className="flex flex-col gap-3">
      <BlogTable initialData={initialData} />
    </div>
  );
}
