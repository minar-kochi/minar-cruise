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
      <div className="flex gap-2 flex-wrap items-center justify-center">
        {data &&
          data.pages &&
          data.pages.map((page, i) => {
            return (
              page &&
              page.response.map((item) => {
                return (
                  <button
                    key={`${item.id}-choose-image-${i}`}
                    className="cursor-pointer max-w-[150px]  group-[.image-upload]:max-w-[350px] w-full"
                    onClick={() => handleImageClick(item.id, item.url)}
                  >
                    <Image
                      className="rounded-md w-full h-full object-cover"
                      src={item.url}
                      alt={item.alt}
                      width={720}
                      height={480}
                    />
                  </button>
                );
              })
            );
          })}
        <div ref={ref} className="w-full h-2" />
      </div>
    </div>
  );
}
