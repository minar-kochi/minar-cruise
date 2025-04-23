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

export default function BlogTable({
  initialData,
}: {
  initialData: {
    blogs: TGetBlogsListDTO;
    nextCursor: string | undefined;
  };
}) {
  const { data, isFetching, fetchNextPage } =
    trpc.admin.blog.fetchBlogsInfinityQuery.useInfiniteQuery(
      { limit: 6 },
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
        toast.error("Seed incomplete, Please Try again");
      },
    });

  async function handleSeed() {
    seedBlogs({ count: 6 });
  }

  console.log(data);

  return (
    <div>
      <div className="p-2">
        <Table className="">
          <TableCaption>A list of your recent blogs.</TableCaption>
          <TableHeader className="">
            <TableRow className="text-lg bg-muted">
              <TableHead className="">Content</TableHead>
              <TableHead>Author</TableHead>
              <TableHead className="">status</TableHead>
              <TableHead className="">Date Published</TableHead>
              <TableHead className="text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.pages.map((items) =>
              items.blogs.map(
                (
                  { author, blogStatus, createdAt, id, image, shortDes, title },
                  i,
                ) => {
                  return (
                    <TableRow
                      key={`${id}-${createdAt}-${i}`}
                      className="cursor-pointer"
                    >
                      <TableCell className=" flex  gap-5">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          width={640}
                          height={480}
                          className="w-28 h-16 object-cover rounded-md"
                        />
                        <div className="flex flex-col justify-center">
                          <h2 className="font-medium">{title}</h2>
                          <p>{shortDes}</p>
                        </div>
                      </TableCell>
                      <TableCell>{author}</TableCell>
                      <TableCell>{blogStatus}</TableCell>
                      <TableCell className="">
                        {format(createdAt, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/blog/update/${id}`}
                          className={cn(buttonVariants({ variant: "link" }))}
                        >
                          Update
                        </Link>
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

      <div className="flex justify-between">
        <Button onClick={() => fetchNextPage()}>
          {isFetching ? (
            <Loader2 className="animate-spin h-4 w-full" />
          ) : (
            "load more"
          )}
        </Button>

        <Button onClick={handleSeed}>Seed data</Button>
      </div>
    </div>
  );
}
