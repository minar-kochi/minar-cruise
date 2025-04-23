"use client";

import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { trpc } from "@/app/_trpc/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { TGetBlogsListDTO } from "@/db/data/dto/blog";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BLOG_INFINITE_QUERY_LIMIT, VIEW_BEFORE_PX } from "@/constants/config";
import { useInView } from "react-intersection-observer";

export default function BlogTable({
  initialData,
}: {
  initialData: {
    blogs: TGetBlogsListDTO;
    nextCursor: string | undefined;
  };
}) {
  const { ref } = useInView({
    threshold: 0,
    rootMargin: `${VIEW_BEFORE_PX}px 0px`,
    onChange(inView, entry) {
      if (entry.isIntersecting) {
        fetchNextPage();
      }
    },
  });
  const { data, isFetching, fetchNextPage } =
    trpc.admin.blog.fetchBlogsInfinityQuery.useInfiniteQuery(
      { limit: BLOG_INFINITE_QUERY_LIMIT },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialData: {
          pages: [
            {
              blogs: (initialData?.blogs ?? []).map((blog) => ({
                ...blog,
                createdAt:
                  blog.createdAt instanceof Date
                    ? blog.createdAt.toISOString()
                    : blog.createdAt,
              })),
              nextCursor: initialData?.nextCursor ?? undefined,
            },
          ],
          pageParams: [null],
        },
      },
    );

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
        toast.dismiss();
        toast.error("Seed incomplete, Please Try again");
      },
    });

  const { mutate: deleteBlog } = trpc.admin.blog.deleteBlog.useMutation({
    onMutate() {
      toast.loading("Deleting record");
    },
    onError() {
      toast.dismiss();
      toast.error("Failed to delete record");
    },
    onSuccess() {
      toast.dismiss();
      toast.success("Blog Deleted Successfully");
    },
  });
  async function handleSeed() {
    seedBlogs({ count: 6 });
  }

  return (
    <div>
      <div className="p-2">
        <Table className="">
          {/* <TableCaption>A list of your recent blogs.</TableCaption> */}
          <TableHeader className="">
            <TableRow className="bg-muted">
              <TableHead className="">CONTENT</TableHead>
              <TableHead>AUTHOR</TableHead>
              <TableHead className="">STATUS</TableHead>
              <TableHead className="text-center">DATE PUBLISHED</TableHead>
              <TableHead className="text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages.map((items) =>
              items.blogs.map(
                (
                  { author, blogStatus, createdAt, id, image, shortDes, title },
                  index,
                ) => {
                  return (
                    <TableRow
                      key={`${id}-${createdAt}-${index}`}
                      className="cursor-pointer"
                    >
                      <TableCell className="flex  gap-5">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          width={640}
                          height={480}
                          className="w-28 h-16 object-cover rounded-md "
                        />
                        <div className="flex flex-col justify-center">
                          <h2 className="font-bold">{title}</h2>
                          <p>{shortDes}</p>
                        </div>
                      </TableCell>
                      <TableCell>{author}</TableCell>
                      <TableCell>{blogStatus}</TableCell>
                      <TableCell className="text-center">
                        {format(createdAt, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <Link
                            href={`/admin/blog/update/${id}`}
                            className={cn(buttonVariants({ variant: "link" }))}
                          >
                            Update
                          </Link>
                          <Button
                            className={cn("")}
                            variant={"dangerLink"}
                            onClick={() => deleteBlog({ id })}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                },
              ),
            )}
          </TableBody>
          {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
        </Table>
      </div>

      <div
        ref={ref}
        className={cn(``, {
          "animate-pulse bg-muted": isFetching,
        })}
      >
        {isFetching ? (
          <div className="h-20 flex items-center justify-center">
            <Loader2 className="animate-spin h-10 w-full" />
          </div>
        ) : null}
      </div>
      <div className="flex items-center text-center w-fit mx-auto">
        <p className="text-lg font-bold">Seed blogs here :</p>
        <Button onClick={handleSeed} variant={"link"} className="px-2">
          Seed blogs
        </Button>
      </div>
    </div>
  );
}
