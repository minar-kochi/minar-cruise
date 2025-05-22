import DisplayBlog from "@/components/admin/blog/DisplayBlog";
import { getBlogDetailsFromSlug } from "@/db/data/dto/blog";

export default async function blogPage({
  params: { blogSlug },
}: {
  params: { blogSlug: string };
}) {
  const data = await getBlogDetailsFromSlug({ blogSlug });
  if (!data) return;

  return (
    <DisplayBlog
      author={data.author}
      title={data.title}
      selectedImg={data.image.url}
      content={data.content}
    />
  );
}
