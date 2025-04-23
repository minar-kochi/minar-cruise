import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import { getBlogPosts, getBlogWithPagination } from "@/db/data/dto/blog";
import { constructMetadata } from "@/lib/helpers/constructMetadata";
import BlogPagination from "@/components/blog/blog-pagination";
import { BLOG_PAGINATION_QUERY_LIMIT } from "@/constants/config";
import BlogList from "@/components/blog/blog-list";

export const metadata = constructMetadata({
  MetaHeadtitle: "Blog Page | Minar Cruise",
  description:
    "Explore our insightful blog for travel tips, destination guides, technology trends, and lifestyle advice. Stay inspired and informed. ",
});

const AllBlogsPage = async () => {
  const data = await getBlogWithPagination({
    pageNumber: 1,
    pageSize: BLOG_PAGINATION_QUERY_LIMIT,
  });
  if (!data.blogs.length) {
    console.log("could not fetch data");
    return null;
  }

  return (
    <div className="bg-white">
      <FacilitiesImageCard label="Blog" overlapTitle="Blogs" />
      <Bounded className="">
        <BlogList paginatedInitialData={data} />
      </Bounded>
    </div>
  );
};

export default AllBlogsPage;
