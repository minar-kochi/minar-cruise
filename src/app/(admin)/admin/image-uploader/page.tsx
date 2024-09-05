

import ChooseImg from "@/components/admin/blog/ChooseImg";
import UploadBlogImage from "@/components/uploadImageDialog";
import { useState } from "react";

export default function ImageUpload() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <input
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
      /> */}
      <UploadBlogImage/>
      {/* <Dialog>
        <DialogTrigger className={cn(buttonVariants({ variant: "default" }))}>
          Upload Image
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>
              Please add in
              <span className="font-medium text-black"> Alt Tag's </span>a
              descriptive text for SEO, as it will boost the image to linking
              the image to website
            </DialogDescription>
          </DialogHeader>
          <UploadDropzone
            // onDrop={(accFiles) => {}}
            endpoint="imageUploader"
            // className={cn({
            //   "cursor-not-allowed": altText.length < 20,
            // })}
            // disabled={altText.length < 20}
            input={{ alt: altText }}
            onClientUploadComplete={(res) => {
              // Do something with the response
              toast.success(`Upload Completed`);
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              console.log(error);
              toast.error(`ERROR! ${error.message}`);
            }}
          />
          <Textarea
            placeholder="Enter alt text for SEO"
            value={altText}
            // onChange
            onChange={(e) => setAltText(e.target.value)}
          />
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog> */}
      <div className="mt-20">
        <h2 className="text-lg mb-2 font-medium">
          Images in your Uploaded Gallery
        </h2>
        <ChooseImg />
      </div>
    </main>
  );
}
