"use client";
import { trpc } from "@/app/_trpc/client";
import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";
import React from "react";
import PackageImageCard from "@/components/admin/cruise-package/packageImageCard";

import PackageChooseImage from "@/components/admin/cruise-package/PackageChooseImage";
import PackageDetailsForm from "@/components/admin/cruise-package/PackageDetailsForm";
import PackageAmenitiesEditor from "@/components/admin/cruise-package/PackageAmenitiesEditor";
import PackageSettingsForm from "@/components/admin/cruise-package/PackageSettingsForm";
import Bounded from "@/components/elements/Bounded";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function PackageEditPage({
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
          title="Edit package"
          description="Change the package's copy, prices and amenities, choose its images, or hide it from the public site. Every save refreshes the live pages straight away."
        />
      </div>
      <Bounded>
        <h3 className="flex items-center justify-center text-2xl font-bold">
          {data?.title ? data?.title : ""}
        </h3>
      </Bounded>

      <Tabs defaultValue="details" className="mt-6 px-4">
        <TabsList className="mx-auto flex w-full max-w-xl">
          <TabsTrigger className="flex-1" value="details">
            Details
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="amenities">
            Amenities
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="settings">
            Settings
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="images">
            Images
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <PackageDetailsForm packageId={id} />
        </TabsContent>

        <TabsContent value="amenities" className="mt-6">
          <PackageAmenitiesEditor packageId={id} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <PackageSettingsForm packageId={id} />
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          <div className="flex w-full justify-end">
            <PackageChooseImage packageId={id} />
          </div>
          <div className="mt-12 flex items-center justify-center">
            {isLoading ? <Loader2 className="animate-spin" /> : null}
          </div>
          <div className="flex flex-wrap items-center justify-center p-4">
            {data &&
              data.packageImage.map((dbImage) => {
                return (
                  <PackageImageCard
                    key={`${dbImage.imageId}-${dbImage.packageId}-PackageImageCard`}
                    dbImage={dbImage}
                  />
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
