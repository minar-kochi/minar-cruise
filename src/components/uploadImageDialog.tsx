"use client";
import React, { useState } from "react";
// import from "@/src"
import Dropzone from "react-dropzone";
import { CloudIcon, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useUploadThing } from "./admin/uploadthing/uploadthing";
import toast from "react-hot-toast";
import { Textarea } from "./ui/textarea";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
const UploadBlogImage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const { toast } = useToast();
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  const [altText, setAltText] = useState("");

  const [image, setImage] = useState<File[] | null>(null);

  const [imagePreview, setImagePreview] = useState("");

  async function handleSubmit() {
    try {
      if (altText.length < 20) {
        toast.error("Please enter something Larger than 20");
        return;
      }
      if (!image?.length) {
        toast.error("Please select a file.");
        return;
      }
      console.log(image);
      await startUpload(image, { alt: altText });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    // <div className="w-full bg-white/80 flex flex-col items-center justify-center rounded-2xl max-w-sm aspect-[4/2.5]">
    <Dialog
      open={isOpen}
      onOpenChange={(v: boolean) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger
        onClick={() => setIsOpen(true)}
        className={cn(
          buttonVariants({ variant: "default", className: "w-full" }),
        )}
      >
        Upload Image
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Please add in
            <span className="font-medium text-white"> Alt Tag&apos;s </span>a
            descriptive text for SEO, as it will boost the image to linking the
            image to website
          </DialogDescription>
        </DialogHeader>

        <Dropzone
          multiple={false}
          useFsAccessApi={true}
          onDrop={async (acceptedFiles) => {
            setImage(acceptedFiles);
            setImagePreview(URL.createObjectURL(acceptedFiles[0]));
          }}
        >
          {({ getRootProps, getInputProps, acceptedFiles }) => (
            <div
              {...getRootProps()}
              className={cn("min-h-64 m-4", {
                "animate-pulse ": isUploading,
              })}
            >
              <div className="flex transition-all items-center relative border  border-dashed rounded-lg bg-primary-foreground  justify-center h-full w-full">
                {image?.length ? (
                  <>
                    <Image
                      // unoptimized
                      alt="Image Preview"
                      src={imagePreview}
                      width={720}
                      height={480}
                      className="w-full h-full object-cover absolute z-[2] rounded-xl"
                    />
                  </>
                ) : null}
                <input {...getInputProps()} />
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col   items-center justify-center w-full h-full  cursor-pointer   "
                >
                  <div className="flex z-0 relative flex-col items-center justify-center pt-5 pb-6">
                    <CloudIcon className="h-6 w-6 text-muted-foreground mb-2" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">
                        {" "}
                        Click / Drag and Drop
                      </span>
                      {` `}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      image upto 1MB
                    </p>
                  </div>
                </label>
                <div className="my-2 h-5 translate-all flex items-center justify-center gap-2 relative z-10">
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <p>Uploading...</p>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </Dropzone>
        <Textarea
          placeholder="Enter alt text for SEO"
          value={altText}
          // onChange
          onChange={(e) => setAltText(e.target.value)}
        />
        <Button
          disabled={isUploading}
          onClick={async () => await handleSubmit()}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <p>Uploading...</p>
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </DialogContent>
    </Dialog>
    // </div>
  );
};

export default UploadBlogImage;
