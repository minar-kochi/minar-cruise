// This route will catch the blog-slug and displays individual blog page

import { getBlogPostBySlug } from "@/db/data/dto/blog";

interface BlogPage {
  params: {
    slug: string;
  };
}

export default async function BlogPost({ params: { slug } }: BlogPage) {
  const data = await getBlogPostBySlug({ slug });
  console.log(getBlogPostBySlug);
  return <div>This is blog post</div>;
}
