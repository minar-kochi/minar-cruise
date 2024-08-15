// import { getBlogPosts } from "@/db/data/dto/blog";
// import React from "react";

// // Blogs will display here

// const AllBlogPosts = async () => {
//   const blogPosts = await getBlogPosts();

//   if (!blogPosts) {
//     return (
//       // TODO:- Add a alternative to Image Gallery if not found / empty
//       <></>
//     );
//   }
//   // console.log(blogPosts);

//   return (
//     <div>
//       {blogPosts.map((blog) => (
//         <div key={blog.id}>
//           <h2>{blog.title}</h2>
//           <h2>{blog.blogSlug}</h2>
//           <p>{blog.content}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AllBlogPosts;

import BlogCard from "@/components/blog/BlogCard";
import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import { blogCard } from "@/constants/blog/blog";

export default function page() {
  return (
    <div>
      <FacilitiesImageCard label="Blog" />
      <Bounded className="flex gap-6 flex-wrap pt-10 pb-28">
        {blogCard.map((card, i) => (
          <BlogCard
            key={i}
            title={card.title}
            desc={card.desc}
            imgUrl={card.imgUrl}
            link={card.link}
          />
        ))}
      </Bounded>
    </div>
  );
}
