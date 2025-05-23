import BlogList from "@/components/blog/blog-list";
import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import { BLOG_PAGINATION_QUERY_LIMIT } from "@/constants/config";
import {
  getBlogWithPagination,
  getPublishedBlogsCount,
} from "@/db/data/dto/blog";
import { constructMetadata } from "@/lib/helpers/constructMetadata";

export const metadata = constructMetadata({
  MetaHeadtitle: "Blog Page | Minar Cruise",
  description:
    "Explore our insightful blog for travel tips, destination guides, technology trends, and lifestyle advice. Stay inspired and informed. ",
});

export async function generateStaticParams() {
  const totalBlogs = await getPublishedBlogsCount();
  const totalPages = Math.ceil(totalBlogs / BLOG_PAGINATION_QUERY_LIMIT);

  return Array.from({ length: totalPages }).map((_, index) => ({
    pageNumber: (index + 1).toString(),
  }));
}

interface IPaginatedBlogsPagesProps {
  params: { pageNumber: string };
}

export default async function PaginatedBlogsPages({
  params: { pageNumber },
}: IPaginatedBlogsPagesProps) {
  const data = await getBlogWithPagination({
    pageNumber: Number(pageNumber),
    pageSize: BLOG_PAGINATION_QUERY_LIMIT,
  });
  return (
    <div>
      <FacilitiesImageCard label="Blog" overlapTitle="Blogs" />
      <Bounded className="">
        <BlogList data={data} />
      </Bounded>
    </div>
  );
}
