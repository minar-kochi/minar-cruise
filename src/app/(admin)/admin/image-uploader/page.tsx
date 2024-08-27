"use client";

import ChooseImg from "@/components/admin/blog/ChooseImg";
import { UploadButton, UploadDropzone } from "../../../../utils/uploadthing";

export default function ImageUpload() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadDropzone
        endpoint="imageUploader"
        className="w-80 cursor-pointer"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
      <div className="mt-20">
        <h2 className="text-lg mb-2 font-medium">Images in your uploaded gallery</h2>
        <ChooseImg  />
      </div>
    </main>
  );
}
