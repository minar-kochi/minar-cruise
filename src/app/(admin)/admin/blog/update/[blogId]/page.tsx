import BlogForm from "@/components/admin/blog/form/blog-form";
import { db } from "@/db";
import { Suspense } from "react";

interface IUpdateBlogProps {
  params: { blogId: string };
  searchParams: {};
}

export default async function UpdateBlog({
  params: { blogId },
}: IUpdateBlogProps) {
  const blog = await db.blog.findUnique({
    where: {
      id: blogId,
    },
  });

  return (
    <Suspense fallback={<>loading...</>}>
      <BlogForm type="UPDATE" prefill={blog ?? undefined} />{" "}
    </Suspense>
  );
}
