"use client";
import { trpc } from "@/app/_trpc/client";
import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";
import React from "react";
import PackageImageCard from "@/components/admin/cruise-package/packageImageCard";

import PackageChooseImage from "@/components/admin/cruise-package/PackageChooseImage";
import Bounded from "@/components/elements/Bounded";
import { Loader2 } from "lucide-react";

export default async function PackageImagePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { data, isLoading } = trpc.admin.packages.getPackageImage.useQuery({
    id,
  });
  return (
    <main>
      <div>
        <HeaderTitleDescription
          title={`Package Image Page`}
          description="Manage and add schedules effortlessly. View existing schedules, create or update time slots, and select packages for various events like breakfast, lunch, and more."
        />
      </div>
      <Bounded>
        <h3 className="flex items-center justify-center font-bold text-2xl">
          {data?.title ? data?.title : ""}
        </h3>
        <div className="flex w-full justify-end">
          <PackageChooseImage packageId={id} />
        </div>
      </Bounded>
      <div className="flex items-center justify-center mt-12">
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-wrap justify-center items-center p-4">
        {data &&
          data.packageImage.map((dbImage) => {
            return (
              <PackageImageCard
                key={`${dbImage.imageId}-${dbImage.packageId}`}
                dbImage={dbImage}
              />
            );
          })}
      </div>
    </main>
  );
}
