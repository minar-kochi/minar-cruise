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
    <div className="">
      <div className="border  rounded-md p-2 bg-sidebar m-2">
        <Table className="">
          {/* <TableCaption>A list of your recent blogs.</TableCaption> */}
          <TableHeader className="bg-muted-foreground/10 ">
            <TableRow className="">
              <TableHead className="text-[12px] md:text-sm text-center sm:text-left">
                CONTENT
              </TableHead>
              <TableHead className="text-[12px] md:text-sm  max-sm:hidden">
                AUTHOR
              </TableHead>
              <TableHead className="text-[12px] md:text-sm max-[380px]:hidden">
                STATUS
              </TableHead>
              <TableHead className="text-[12px] md:text-sm  max-lg:hidden text-center">
                DATE PUBLISHED
              </TableHead>
              <TableHead className="text-[12px] md:text-sm  text-center "></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {data?.pages.map((items) =>
              items.blogs.map(
                (
                  { author, blogStatus, createdAt, id, image, shortDes, title },
                  index,
                ) => {
                  return (
                    <TableRow
                      key={`${id}-${createdAt}-${index}`}
                      className="cursor-pointer "
                    >
                      <TableCell className="flex gap-5 ">
                        <div className="border w-fit h-fit max-[220px]:hidden">
                          <div className="w-16 h-14  md:w-28 md:h-20 ">
                            <Image
                              src={image.url}
                              alt={image.alt}
                              width={640}
                              height={480}
                              className="w-16 h-14 md:w-28 md:h-20 object-cover rounded-md "
                            />
                          </div>
                        </div>
                        <div className="flex flex-col max-w-[600px] w-full">
                          <h2 className="font-bold text-[14px] md:text-sm lg:text-[17px] line-clamp-1">
                            {truncateText(title, 60)}
                          </h2>
                          <p className="text-ellipsis overflow-hidden lg:text-[15px] line-clamp-2 md:line-clamp-3">
                            {truncateText(shortDes, 200)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className=" px-0 min-w-max max-sm:hidden">
                        <p className="text-xs w-full  pl-1 md:text-sm md:px-2 lg:px-3 xl:px-4">
                          {truncateText(author, 12)}
                        </p>
                      </TableCell>
                      <TableCell className=" px-0 min-w-max max-[380px]:hidden">
                        <p className="text-xs w-full  pl-1 md:text-sm md:px-2 lg:px-3 xl:px-4">
                          {blogStatus}
                        </p>
                      </TableCell>
                      <TableCell className="max-lg:hidden text-center text-xs lg:text-sm px-1 md:px-1 lg:px-2 xl:px-3">
                        {format(createdAt, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-xs lg:text-sm px-1 md:px-1 lg:px-2 xl:px-3 ">
                        <div className="flex flex-col max-sm:hidden">
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
                        <div className="sm:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <EllipsisVertical size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="">
                              <DropdownMenuItem>
                                <Link
                                  href={`/admin/blog/update/${id}`}
                                  className={cn(
                                    buttonVariants({ variant: "link" }),
                                  )}
                                >
                                  Update
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Button
                                  className={cn("")}
                                  variant={"dangerLink"}
                                  onClick={() => deleteBlog({ id })}
                                >
                                  Delete
                                </Button>
                              </DropdownMenuItem>
                            </DropdownMenuContent>{" "}
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                },
              ),
            )}
          </TableBody>
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
