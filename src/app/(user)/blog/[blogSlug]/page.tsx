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
const defaultImage =
  "https://cochincruiseline.com/wp-content/uploads/2023/10/dinner-9-580x450.jpg";

export default async function BlogPostPage({ params: { blogSlug } }: BlogPage) {
  const blogPost = await getBlogPostById({ id: blogSlug });
  if (!blogPost) {
    console.log("could not fetch data");
    return null;
  }
  return (
    <div className="bg-white">
      <FacilitiesImageCard
        label="Blog"
        overlapTitle={blogPost.title}
        author={`By~${blogPost.author}`}
      />
      <Bounded className="pt-6 pb-52 grid grid-cols-[70%_30%]  max-lg:block gap-5">
        <div className="grid grid-rows-[40%_60%] max-lg:block">
          <div className="">
            <Image
              src={blogPost.image?.url || ""}
              alt={blogPost.title}
              width={1140}
              height={760}
              className="w-full max-h-[550px] rounded-max-lg"
            />
          </div>

          <div className="prose w-full max-w-full">
            <MDXRemote source={blogPost.content} />
          </div>
        </div>

        <div className="grid grid-rows-[40%_60%] max-lg:block">
          <div className="">
            <RecentBlogPosts />
          </div>

          <div className="">
            <PackagesInBlog />
          </div>
        </div>
      </Bounded>
    </div>
  );
}
