
import BlogCard from "@/components/blog/BlogCard";
import { TGetBlogWithPagination } from "@/db/data/dto/blog";
import BlogPagination from "./blog-pagination";

interface IBlogListProps {
  data: TGetBlogWithPagination;
}
export default function BlogList({ data }: IBlogListProps) {

  return (
    <div className="">
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 w-full pt-10 pb-10 gap-4">
        {data.blogs.map((blog) => (
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
        totalNumberOfPages={data.meta.totalPages}
        currentPageNumber={data.meta.currentPage }
      />
    </div>
  );
}
