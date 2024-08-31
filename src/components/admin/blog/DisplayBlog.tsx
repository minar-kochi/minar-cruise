import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import Image from "next/image";
import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";

export default function DisplayBlog({
  title,
  selectedImg,
  author,
  content,
}: {
  title: string;
  selectedImg?: string;
  author: string;
  content: string;
}) {
  return (
    <div className="">
      <FacilitiesImageCard
        label="blog"
        overlapTitle={title ?? "Your title is shown here"}
        author={`By~${author}`}
      />
      <div className="flex items-center justify-center flex-col text-center mt-12">
        <div className="">
          {selectedImg ? (
            <Image
              src={selectedImg}
              alt="selected image"
              width={380}
              height={380}
            />
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto  prose mt-12 ">
        <Markdown
          className="break-words"
          remarkPlugins={[remarkGfm, remarkToc]}
        >
          {content ? `${content}` : ""}
        </Markdown>
      </div>
    </div>
  );
}
