"use client";
import { trpc } from "@/app/_trpc/client";
import ChooseImg from "@/components/admin/blog/ChooseImg";
import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";
import UploadBlogImage from "@/components/uploadImageDialog";
import Image from "next/image";
import React from "react";

export default function PackageImagePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { data } = trpc.admin.packages.getPackageImage.useQuery({
    id,
  });
  return (
    <main>
      <div>
        <HeaderTitleDescription
          title="Package Page"
          description="Manage and add schedules effortlessly. View existing schedules, create or update time slots, and select packages for various events like breakfast, lunch, and more."
        />
      </div>
      {data &&
        data.packageImage.map((item) => {
          return (
            <div
              className="max-w-sm p-4 border-2 relative  rounded-2xl m-2"
              key={`${item.imageId}-${item.packageId}`}
            >
              <div className="relative w-full h-full">
                <p className="absolute p-2 top-0 rounded-tl-xl bg-black/50 text-white font-medium">
                  {item.ImageUse}
                </p>
                <Image
                  alt={item.image.alt}
                  src={item.image.url}
                  width={350}
                  height={350}
                  className="w-full h-full rounded-xl"
                />
              </div>
              <p className="p-2">{item.image.alt}</p>
            </div>
          );
        })}
      {/* <ChooseImg /> */}
    </main>
  );
}
