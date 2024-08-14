import { getBlogPosts } from "@/db/data/dto/blog";
import React from "react";

// Blogs will display here

const AllBlogPosts = async () => {
  const blogPosts = await getBlogPosts();

  if (!blogPosts) {
    return (
      // TODO: #LOW - Add a alternative to Image Gallery if not found / empty
      <></>
    );
  }
  // console.log(blogPosts);

  return (
    <div>
      {blogPosts.map((blog) => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
        </div>
      ))}
    </div>
  );
};

export default AllBlogPosts;
