// // This route will catch the blog-slug and displays individual blog page

// import { getBlogPostBySlug } from "@/db/data/dto/blog";

// interface BlogPage {
//   params: {
//     slug: string;
//   };
// }

// export default async function BlogPost({ params: { slug } }: BlogPage) {
//   const data = await getBlogPostBySlug({ slug });
//   console.log(getBlogPostBySlug);
//   return <div>This is blog post</div>;
// }

import Bounded from "@/components/elements/Bounded";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import { blogCard } from "@/constants/blog/blog";
import { AllPackages } from "@/constants/packages/package";
import { Star } from "lucide-react";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";

export default function page() {
  return (
    <div>
      <FacilitiesImageCard label="Blog" />
      <Bounded className="pt-6 pb-28 ">
        <div className="lg:flex justify-center gap-6">
          <Image
            src="/assets/nightPhoto.jpg"
            alt="trial"
            width={700}
            height={400}
            className=""
          />
          <div className=" border-[1px] border-muted py-5 px-7  min-w-80 rounded-xl">
            <h1 className="text-2xl font-bold pt-2 pb-3">Recent Posts</h1>

            {blogCard.map((post, i) => (
              <div key={i} className="py-3 gap-4 rounded-xl flex">
                <Image
                  src={post.imgUrl}
                  alt="trial"
                  width={80}
                  height={80}
                  className="object-cover aspect-square rounded-xl"
                />
                <h2 className="text-base font-semibold max-w-max ">
                  {post.title}
                </h2>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:flex justify-center gap-6">
          <div>remotemdxcontent</div>
          {/* < MDXRemote source={Markdown}/> */}
          <div>
            <h1>Minar Cruise Packages</h1>
            {/* {AllPackages.map((package, i) => (
              <div key={i} className="flex">
                <Image src="/sss" alt="trial" width={80} height={80} />
                <div className="">
                  <Star />
                  <h2>{}</h2>
                  <p>From</p>
                </div>
              </div>
            ))} */}
          </div>
        </div>
      </Bounded>
    </div>
  );
}
