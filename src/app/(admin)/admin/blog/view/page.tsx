"use client";

import { trpc } from "@/app/_trpc/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { db } from "@/db";
import { cn } from "@/lib/utils";
import { faker } from "@faker-js/faker";
import { $Enums, Blog } from "@prisma/client";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";

export default function page() {
  const { data, isFetching } =
    trpc.admin.blog.fetchAllBlogsInfinityQuery.useQuery();
  const { mutate: seedBlogs, isPending } =
    trpc.admin.blog.seedBlogs.useMutation({
      onMutate() {
        toast.loading("Seeding data...");
      },
      onSuccess() {
        toast.dismiss();
        toast.success("Seeding complete");
      },
      onError() {
        toast.error("Seed incomplete, Please Try again");
      },
    });
    // remove this line when trpc types inference are available
  const blogs: Blog[] = data;

  async function handleSeed() {
    await seedBlogs({ count: 2 });
  }

  return (
    <div>
      {/* <Button onClick={() => fetch()}>fetch blogs</Button> */}
      <div className="w-full border-4 p-4  flex flex-col">
        {isFetching ? (
          <div className="flex flex-col gap-3">
            <div className="animate-ping w-full h-10 bg-muted"></div>
            <div className="animate-ping w-full h-10 bg-muted"></div>
            <div className="animate-ping w-full h-10 bg-muted"></div>
            <div className="animate-ping w-full h-10 bg-muted"></div>
          </div>
        ) : null}
        {blogs?.map((blog, blogIndex) => {
          return (
            <div
              key={`${blog.id}+${blogIndex}`}
              className="flex justify-between border"
            >
              <div className=" p-3 w-full flex flex-col">
                <p>title: {blog.title}</p>
                <p>Description: {blog.shortDes}</p>
                <p>Author: {blog.author}</p>
              </div>
              <Link
                className={cn(buttonVariants({ variant: "link" }))}
                href={`/admin/blog/update?id=${blog.id}`}
              >
                Update
              </Link>
            </div>
          );
        })}
      </div>
      <Button onClick={handleSeed}>Seed Blogs</Button>

    </div>
  );
}
