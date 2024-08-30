"use client";

import ChooseImg from "@/components/admin/blog/ChooseImg";
import {
  UploadButton,
  UploadDropzone,
} from "@/components/admin/uploadthing/uploadthing";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ImageUpload() {
  const [altText, setAltText] = useState("");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <input
        type="text"
        placeholder="Enter alt text for SEO"
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
        className="mt-4 p-2 border rounded-lg bg-black "
      />
      <UploadDropzone
        endpoint="imageUploader"
        className="w-80 cursor-pointer"
        input={{ alt: altText }}
        onClientUploadComplete={(res) => {
          // Do something with the response
          toast.success(`Upload Completed`);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          toast.error(`ERROR! ${error.message}`);
        }}
      />

      <div className="mt-20">
        <h2 className="text-lg mb-2 font-medium">
          Images in your Uploaded Gallery
        </h2>
        <ChooseImg />
      </div>
    </main>
  );
}
