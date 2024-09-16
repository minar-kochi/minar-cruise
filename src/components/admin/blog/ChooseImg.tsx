"use client";
import { trpc } from "@/app/_trpc/client";
import LoadingState from "@/components/custom/Loading";
import { Button } from "@/components/ui/button";
import { getBlogPostById } from "@/db/data/dto/blog";
import { cn } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { nanoid } from "@reduxjs/toolkit";
import { Copy, CopyCheck, Link2, Tags } from "lucide-react";
import Image from "next/image";
import React from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";

interface ChooseImgProps {
  onSelectImage?: (imageId: string, url: string) => void;
  showLink?: boolean;
}

const VIEW_BEFORE_PX = 150;

export default function ChooseImg({
  onSelectImage,
  showLink = false,
}: ChooseImgProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: `${VIEW_BEFORE_PX}px 0px`,
    onChange(inView, entry) {
      console.log(inView);
      if (entry.isIntersecting) {
        toast.success("interescted");
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="flex gap-2 flex-wrap xscroll items-center justify-center  group-[.cruise-package]:grid group-[.cruise-package]:grid-cols-2">
        {data &&
          data.pages &&
          data.pages.map((page, i) => {
            return (
              page &&
              page.response.map((item) => {
                return (
                  <div
                    key={`${item.fileKey}-choose-image-${i}-cruise-package-${nanoid(5)}`}
                    className="cursor-pointer relative group-[.cruise-package]:max-w-[270px] group-[.cruise-package]:aspect-square  group-[.image-upload]:max-w-[350px] w-full flex"
                  >
                    <div
                      className={cn("absolute right-0", {
                        "hidden border-2": !showLink,
                      })}
                    >
                      <div
                        onClick={() => {
                          handleCopy(item.url);
                          toast.success("Link Copied");
                        }}
                        className="copy bg-black/85  p-2 top-0 z-10 border-b  border-white "
                      >
                        <Link2 />
                      </div>
                      <div
                        onClick={() => {
                          handleCopy(item.alt);
                          toast.success("Alt Tag Copied");
                        }}
                        className="copy bg-black/85 rounded-bl-lg  p-2 top-0 z-10 "
                      >
                        <Tags />
                      </div>
                    </div>
                    <button
                      onClick={() => handleImageClick(item?.id, item?.url)}
                      className="w-[350px] h-[262px]"
                    >
                      <Image
                        className="rounded-md w-full h-full object-cover"
                        src={item?.url ?? "/assets/world-map.png"}
                        alt={item?.alt}
                        width={720}
                        height={480}
                      />
                    </button>
                  </div>
                );
              })
            );
          })}
        <div />
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
        <div ref={ref} className="w-full h-2" />
        <Button
          onClick={() => {
            fetchNextPage();
          }}
          className=""
          variant={"secondary"}
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </Button>
      </div>
    </div>
  );
}
