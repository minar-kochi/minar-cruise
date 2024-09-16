"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChooseImg from "@/components/admin/blog/ChooseImg";
import UploadBlogImage from "@/components/uploadImageDialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";
import { TSingularTGetPackageAllImage } from "@/db/data/dto/package";
import Image from "next/image";
import { getPackageImageUseCaseToHumanized } from "@/lib/Data/manipulators/PackageManipulators";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { TrackPreviousIcon } from "@radix-ui/react-icons";

export default function PackageImageCard({
  dbImage,
}: {
  dbImage: TSingularTGetPackageAllImage;
}) {
  const { setData, invalidate } =
    trpc.useUtils().admin.packages.getPackageImage;
  const { mutate } = trpc.admin.packages.removeImage.useMutation({
    onMutate() {
      toast.loading("Removing Image");
    },
    onSuccess(data) {
      toast.dismiss();
      setData({ id: dbImage.packageId }, (isData) => {
        if (!isData?.packageImage?.length) {
          return null;
        }
        return {
          title: isData.title,
          packageImage: isData.packageImage.filter(
            (fv) => fv.id !== dbImage.id,
          ),
        };
      });
      toast.success("Image has been removed");
    },
    onError() {
      toast.error("Failed to remove Image");
    },
  });
  return (
    <div className="max-w-[320px] bg-accent border  rounded-md overflow-hidden p-2  relative   m-2">
      <div className="relative  w-full h-full">
        <div className="absolute max-w-[200px] rounded-md rounded-tl-sm bg-black/80 p-2  text-white font-medium">
          {getPackageImageUseCaseToHumanized(dbImage.ImageUse)}
        </div>
        <Image
          alt={dbImage?.image?.alt ?? "/assets/world-map.png"}
          src={dbImage?.image?.url ?? "/assets/world-map.png"}
          width={350}
          height={350}
          className="w-full h-full rounded-md aspect-square object-cover  "
        />
      </div>

      <p className="p-2">{dbImage.image.alt}</p>
      <Dialog>
        <DialogTrigger
          className={buttonVariants({
            variant: "destructive",
            className: "w-full mt-2 ",
          })}
        >
          Remove Image
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive font-medium text-lg">
              Delete Image
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Image ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <DialogClose className={buttonVariants({ className: "w-full" })}>
              Cancel
            </DialogClose>
            <Button
              variant={"destructive"}
              onClick={() => mutate({ id: dbImage.id })}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
