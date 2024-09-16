import ChooseImg from "@/components/admin/blog/ChooseImg";
import HeaderTitleDescription from "@/components/admin/elements/headerTitleDescription";
import LoadingState from "@/components/custom/Loading";
import UploadBlogImage from "@/components/uploadImageDialog";
import { Suspense, useState } from "react";

export default function ImageUpload() {
  return (
    <Suspense fallback={<LoadingState />}>
      <HeaderTitleDescription
        title="Upload Gallery"
        description="Upload the image to your Storage and use Around package Images multiple times."
      />
      <div className="flex  justify-center my-4 mb-12">
        <div className="max-w-sm w-full">
          <UploadBlogImage />
        </div>
      </div>
      <div className="group image-upload p-4">
        <ChooseImg  showLink={true} />
      </div>
    </Suspense>
  );
}
