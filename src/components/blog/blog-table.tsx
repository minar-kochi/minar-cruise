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
import { EllipsisVertical, Loader2 } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import { cn, truncateText } from "@/lib/utils";
import { BLOG_INFINITE_QUERY_LIMIT, VIEW_BEFORE_PX } from "@/constants/config";
import { useInView } from "react-intersection-observer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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

  const utils = trpc.useUtils();
  const infiniteQueryInput = { limit: BLOG_INFINITE_QUERY_LIMIT };
  const { data, isFetching, fetchNextPage } =
    trpc.admin.blog.fetchBlogsInfinityQuery.useInfiniteQuery(
      infiniteQueryInput,
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

  // console.log("data:", data);

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

  const { mutate: deleteBlog, data: deletedData } =
    trpc.admin.blog.deleteBlog.useMutation({
      onMutate() {
        toast.loading("Deleting record");
      },
      onError() {
        toast.dismiss();
        toast.error("Failed to delete record");
      },
      onSuccess(deletedId) {
        utils.admin.blog.fetchBlogsInfinityQuery.setInfiniteData(
          infiniteQueryInput,
          (old) => {
            if (!old) return old;

            const newPage = old.pages.map((page) => {
              return {
                ...page,
                blogs: page.blogs.filter((blog) => blog.id !== deletedId),
              };
            });
            // console.log("new page", newPage);

            return {
              ...old,
              pages: newPage,
            };
          },
        );
        // console.log("id:", deletedId);

        toast.dismiss();
        toast.success("Blog Deleted Successfully");
      },
    });
  async function handleSeed() {
    seedBlogs({ count: 6 });
  }
  return (
    <div className="p-4 space-y-6">
  {/* Blog Table Card */}
  <div className="bg-sidebar border rounded-2xl shadow-sm p-4">
    <Table>
      <TableHeader className="bg-muted-foreground/10">
        <TableRow>
          <TableHead className="text-xs md:text-sm text-center sm:text-left">
            CONTENT
          </TableHead>
          <TableHead className="text-xs md:text-sm max-sm:hidden">AUTHOR</TableHead>
          <TableHead className="text-xs md:text-sm max-[380px]:hidden">STATUS</TableHead>
          <TableHead className="text-xs md:text-sm max-lg:hidden text-center">
            DATE PUBLISHED
          </TableHead>
          <TableHead className="text-xs md:text-sm text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.pages.map((items) =>
          items.blogs.map(
            (
              { author, blogStatus, createdAt, id, image, shortDes, title, blogSlug },
              index,
            ) => (
              <TableRow
                key={`${id}-${createdAt}-${index}`}
                className="hover:bg-muted/30 transition cursor-pointer"
              >
                {/* CONTENT */}
                <TableCell>
                  <Link href={`/admin/blog/view/${blogSlug}`} className="flex gap-4">
                    <div className="hidden max-[220px]:hidden sm:block">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        width={640}
                        height={480}
                        className="w-16 h-14 md:w-28 md:h-20 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex flex-col max-w-[600px] w-full">
                      <h2 className="font-semibold text-sm md:text-base lg:text-lg line-clamp-1">
                        {title}
                      </h2>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 md:line-clamp-3">
                        {shortDes}
                      </p>
                    </div>
                  </Link>
                </TableCell>

                {/* AUTHOR */}
                <TableCell className="max-sm:hidden text-sm">{author}</TableCell>

                {/* STATUS */}
                <TableCell className="max-[380px]:hidden text-sm">{blogStatus}</TableCell>

                {/* DATE */}
                <TableCell className="max-lg:hidden text-center text-sm">
                  {format(createdAt, "dd/MM/yyyy")}
                </TableCell>

                {/* ACTIONS */}
                <TableCell className="text-right">
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <Link
                      href={`/admin/blog/update/${id}`}
                      className={cn(buttonVariants({ variant: "link" }))}
                    >
                      Update
                    </Link>
                    <Button
                      variant="dangerLink"
                      className="text-sm"
                      onClick={() => deleteBlog({ id })}
                    >
                      Delete
                    </Button>
                  </div>
                  <div className="sm:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical size={18} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/blog/update/${id}`}
                            className={cn(buttonVariants({ variant: "link" }))}
                          >
                            Update
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Button
                            variant="dangerLink"
                            className="w-full text-left"
                            onClick={() => deleteBlog({ id })}
                          >
                            Delete
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ),
          ),
        )}
      </TableBody>
    </Table>
  </div>

  {/* Loader */}
  <div
    ref={ref}
    className={cn("transition", {
      "animate-pulse bg-muted h-20 flex items-center justify-center rounded-md": isFetching,
    })}
  >
    {isFetching && <Loader2 className="animate-spin h-10 w-10 text-muted-foreground" />}
  </div>

  {/* Seed Blogs */}
  <div className="flex items-center justify-center gap-2">
    <p className="text-lg font-semibold">Seed blogs here:</p>
    <Button onClick={handleSeed} variant="link" className="px-2 text-primary font-medium">
      Seed blogs
    </Button>
  </div>
</div>

  );
}
