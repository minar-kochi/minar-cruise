import BlogForm from "@/components/admin/blog/form/blog-form";
import { db } from "@/db";
import { Suspense } from "react";

export default async function UpdateBlog({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const { id } = await searchParams;

  const blog = await db.blog.findUnique({
    where: {
      id,
    },
  });
  console.log(blog);

  return <Suspense fallback={<>loading...</>}>
    <BlogForm type="UPDATE" prefill={blog ?? undefined} />;
  </Suspense>;
}
