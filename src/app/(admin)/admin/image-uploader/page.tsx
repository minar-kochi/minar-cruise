"use client";

import ChooseImg from "@/components/admin/blog/ChooseImg";
import { UploadButton, UploadDropzone } from "../../../../utils/uploadthing";
import { useState } from "react";

export default function ImageUpload() {
  const [altText, setAltText] = useState("");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadDropzone
        endpoint="imageUploader"
        className="w-80 cursor-pointer"
        input={{ alt: altText }}
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

      <input
        type="text"
        placeholder="Enter alt text for the image"
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
        className="mt-4 p-2 border rounded-lg bg-black "
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
