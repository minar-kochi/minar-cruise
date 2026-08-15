import { getSectionVisibility } from "@/lib/helpers/config/getSectionVisibility";
import { notFound } from "next/navigation";
import BlogList from "@/components/blog/blog-list";
import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import { BLOG_PAGINATION_QUERY_LIMIT } from "@/constants/config";
import {
  getBlogWithPagination,
  getPublishedBlogsCount,
} from "@/db/data/dto/blog";
import { Metadata } from "next";
import { constructMetadata } from "@/lib/helpers/constructMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return await constructMetadata({
    MetaHeadtitle: "Blog Page | Minar Cruise",
    description:
      "Explore our insightful blog for travel tips, destination guides, technology trends, and lifestyle advice. Stay inspired and informed. ",
  });
}

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
  // Hidden pages must 404, not just lose their nav link.
  const visible = await getSectionVisibility();
  if (!visible["page.blogs"]) notFound();

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
