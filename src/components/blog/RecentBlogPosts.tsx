import { getRecentPosts } from "@/db/data/dto/blog";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function RecentBlogPosts() {
  const recentPosts = await getRecentPosts();
  if (!recentPosts) {
    return <div>Failed to load recent blog posts</div>;
  }
  return (
    <div className=" border-[1px] border-muted h-fit py-5 px-7 rounded-xl">
      <div className="flex items-center pt-2 pb-3 gap-1">
        <div className="text-red-500 text-2xl">|</div>
        <h1 className="text-2xl font-bold ">Recent Posts</h1>
      </div>
      {recentPosts.map((post, i) => (
        <div key={i} className="py-3 gap-4 rounded-xl flex">
          <Image
            src={post.image?.url ?? "/assets/world-map.png"}
            alt="trial"
            width={80}
            height={80}
            className="object-cover aspect-square rounded-xl"
          />

          <Link
            href={`/blog/${post.blogSlug}`}
            className="text-base font-semibold max-w-max hover:text-red-500"
          >
            {post.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
