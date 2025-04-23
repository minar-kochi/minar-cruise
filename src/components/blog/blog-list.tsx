"use client";

import { trpc } from "@/app/_trpc/client";
import BlogCard from "@/components/blog/BlogCard";
import { BLOG_PAGINATION_QUERY_LIMIT } from "@/constants/config";
import { TGetBlogWithPagination } from "@/db/data/dto/blog";
import BlogPagination from "./blog-pagination";
import { useEffect } from "react";
import { useClientSelector } from "@/hooks/clientStore/clientReducers";

interface IBlogListProps {
  paginatedInitialData: TGetBlogWithPagination;
}
export default function BlogList({ paginatedInitialData }: IBlogListProps) {
  const { pageNumber } = useClientSelector((state) => state.blog);

  const { setData } = trpc.useUtils().admin.blog.fetchPaginatedBlogs;

  const initialFetchParams = {
    pageNumber,
    pageSize: BLOG_PAGINATION_QUERY_LIMIT,
  };

  // Setting initial page data for useQuery written below to avoid data duplication
  useEffect(() => {
    setData(initialFetchParams, paginatedInitialData);
  }, [paginatedInitialData, setData]);

  // fetching paginated data
  const { data } =
    trpc.admin.blog.fetchPaginatedBlogs.useQuery(initialFetchParams);

  return (
    <div className="">
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 w-full pt-10 pb-10 gap-4">
        {data?.blogs.map((blog) => (
          <BlogCard
            key={`${blog.id}-BlogCard`}
            title={blog.title}
            desc={blog.shortDes}
            imgUrl={blog.image?.url ?? "/fallback-image.jpg"}
            link={`/blog/${blog.blogSlug}`}
          />
        ))}
      </div>
      <BlogPagination
        totalNumberOfPages={paginatedInitialData.meta.totalPages}
        currentPageNumber={data ? data.meta.currentPage : 1}
      />
    </div>
  );
}
