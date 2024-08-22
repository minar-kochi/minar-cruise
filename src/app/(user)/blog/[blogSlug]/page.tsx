import PackagesInBlog from "@/components/blog/PackagesInBlog";
import RecentBlogPosts from "@/components/blog/RecentBlogPosts";
import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import { getBlogPostById, getBlogPosts } from "@/db/data/dto/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BlogPage {
  params: {
    blogSlug: string;
  };
}
const defaultImage = "https://cochincruiseline.com/wp-content/uploads/2023/10/dinner-9-580x450.jpg"
export default async function BlogPostPage({ params: { blogSlug } }: BlogPage) {
  const blogPost = await getBlogPostById({ id: blogSlug });
  if (!blogPost) {
    return <>Failed to load blog post</>;
  }
  // console.log(blogPost)
  return (
    <div className="bg-white">
      <FacilitiesImageCard label="Blog" />
      <Bounded className="pt-6 pb-28 grid 0 grid-flow-row-dense grid-cols-3 grid-rows-3 max-md:block gap-5">
        <div className="col-span-2">
          <Image
            src={blogPost.image?.url ?? ""}
            alt={blogPost.title}
            width={600}
            height={400}
            className="w-full rounded-lg"
          />
        </div>

        <div>
          <RecentBlogPosts />
        </div>

        <div className="col-span-2 mt-12">
          <MDXRemote source={blogPost.content} />
        </div>

        <div className="mt-12">
          <PackagesInBlog />
        </div>
      </Bounded>
    </div>
  );
}
