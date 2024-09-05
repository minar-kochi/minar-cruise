"use client";
import { trpc } from "@/app/_trpc/client";
import { getBlogPostById } from "@/db/data/dto/blog";
import { DialogClose } from "@radix-ui/react-dialog";
import { nanoid } from "@reduxjs/toolkit";
import Image from "next/image";
import React from "react";
import { useInView } from "react-intersection-observer";

interface ChooseImgProps {
  onSelectImage?: (imageId: string, url: string) => void;
}

const VIEW_BEFORE_PX = 40;

export default function ChooseImg({ onSelectImage }: ChooseImgProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: `${VIEW_BEFORE_PX}px 0px`,
    onChange(inView, entry) {
      console.log(inView);
      if (inView) {
        fetchNextPage();
      }
    },
  });

  const { data, fetchNextPage, isFetching, isFetchingNextPage } =
    trpc.admin.blog.getImagesInfinity.useInfiniteQuery(
      {
        limit: 6,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      },
    );

  const handleImageClick = (id: string, url: string) => {
    onSelectImage && onSelectImage(id, url);
  };

  return (
    <div>
      <div className="">
        {data &&
          data.pages &&
          data.pages.map((page,i) => {
            // let id = nanoid(16)
            return (
              // <div key={`${page.nextCursor}-ChooseImg-${nanoid()}`}>
              <div ref={ref} key={`${i}-page-ChooseImg-${page.nextCursor}`} >
                {page &&
                  page.response.map((item) => {
                    return (
                      <>
                        <button
                          // ref={ref}
                          key={`${item.id}-choose-image`}
                          className="cursor-pointer max-w-[150px] border-2 w-full"
                          onClick={() => handleImageClick(item.id, item.url)}
                        >
                          <Image
                            className="rounded-md"
                            src={item.url}
                            alt={item.alt}
                            width={720}
                            height={480}
                          />
                        </button>
                      </>
                    );
                  })}
              </div>
              // </div>
            );
          })}
      </div>
    </div>
  );
}
