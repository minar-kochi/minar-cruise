import { trpc } from "@/app/_trpc/client";
import { getBlogPostById } from "@/db/data/dto/blog";
import { DialogClose } from "@radix-ui/react-dialog";
import Image from "next/image";
import React from "react";
import { useInView } from "react-intersection-observer";

interface ChooseImgProps {
  onSelectImage: (imageId: string, url: string) => void;
}

const VIEW_BEFORE_PX = 10;

export default function ChooseImg({ onSelectImage }: ChooseImgProps) {

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: `${VIEW_BEFORE_PX}px 0px`,
    onChange(inView, entry) {
      if (inView) {
        fetchNextPage();
      }
    },
  });

  const { data, fetchNextPage, isFetching, isFetchingNextPage } =
    trpc.admin.blog.getImagesInfinity.useInfiniteQuery(
      {
        limit: 2,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      },
    );

  const handleImageClick = (id: string, url: string) => {
    onSelectImage(id, url);

    console.log(`${id}-choose-image`);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {data &&
          data.pages &&
          data.pages.map((page) => {
            return (
              page &&
              page.response.map((item) => {
                return (
                  <>
                    <div
                      ref={ref}
                      key={`${item.id}-choose-image`}
                      className="cursor-pointer"
                      onClick={() => handleImageClick(item.id, item.url)}
                    >
                      <h1>{item.id}</h1>
                      <DialogClose >

                      <Image
                        src={item.url}
                        alt={item.alt}
                        width={300}
                        height={300}
                        />
                        </DialogClose>
                    </div>
                  </>
                );
              })
            );
          })}
      </div>
    </div>
  );
}
