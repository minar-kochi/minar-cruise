import BlogCard from "@/components/blog/BlogCard";
import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import { getBlogPosts } from "@/db/data/dto/blog";

const AllBlogsPage = async () => {
  const blogPosts = await getBlogPosts();

  if (!blogPosts) {
    return (
      // TODO:- Add a alternative to Image Gallery if not found / empty
      <></>
    );
  }
  // console.log(blogPosts);

  return (
    <div className="bg-white">
      <FacilitiesImageCard label="Blog" />
      <Bounded className="grid grid-cols-3 pt-10 pb-28">
        {blogPosts.map((blog) => (
          <BlogCard
            key={blog.id}
            title={blog.title}
            desc={blog.shortDes}
            imgUrl={blog.image?.url ?? ""}
            link={`/blog/${blog.blogSlug}`}
          />
        ))}
      </Bounded>
    </div>
  );
};

export default AllBlogsPage;
