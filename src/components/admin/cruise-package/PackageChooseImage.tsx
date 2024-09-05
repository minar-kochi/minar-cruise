import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useState } from "react";
import ChooseImg from "../blog/ChooseImg";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { $Enums } from "@prisma/client";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
type SelectPackageImage = {
  id: string;
  imageUse: $Enums.IMAGE_USE;
};
const defaultState: SelectPackageImage = { id: "", imageUse: "COMMON" };
export default function PackageChooseImage({
  packageId,
}: {
  packageId: string;
}) {
  const [selectImage, setSelectedImage] = useState<{
    id: string;
    imageUse: $Enums.IMAGE_USE;
  }>(defaultState);
  const [showNext, setNext] = useState(false);
  const { invalidate } = trpc.useUtils().admin.packages.getPackageImage;
  const { mutate: MutatePackageImage } =
    trpc.admin.packages.setPackageImage.useMutation({
      async onSuccess(data, variables, context) {
        toast.success("Package Image has been sucessfully loaded");
        await invalidate({ id: packageId });
        setNext(false);
        setSelectedImage(defaultState);
      },
    });
  const handleMutate = () => {
    if (!selectImage.id) {
      toast.error("Please select a package image");
      return;
    }
    if (!selectImage.imageUse) {
      toast.error("Please select a package image use case");
      return;
    }
    MutatePackageImage({
      data: {
        packageId,
        imageId: selectImage.id,
        ImageUse: selectImage.imageUse,
      },
    });
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger className={buttonVariants()}>
          Add Image Package
        </DialogTrigger>
        <DialogContent className="max-w-xl w-full">
          <DialogHeader>
            <DialogTitle>Select Image for Package to use</DialogTitle>
            <DialogDescription>
              There should only be one Featured Image
            </DialogDescription>
            <div
              className={cn({
                hidden: showNext,
              })}
            >
              <ChooseImg
                onSelectImage={(id, url) => {
                  setSelectedImage({
                    id,
                    imageUse: "COMMON",
                  });
                  setNext(true);
                }}
              />
            </div>
            <div
              className={cn({
                hidden: !showNext,
              })}
            >
              <Select
                onValueChange={(value) => {
                  setSelectedImage((prev) => {
                    return {
                      ...prev,
                      imageUse: value as $Enums.IMAGE_USE,
                    };
                  });
                }}
                defaultValue={"COMMON"}
              >
                <SelectTrigger value={"false"} className="w-full">
                  <SelectValue placeholder={"Select a Package"} />
                </SelectTrigger>
                <SelectContent sticky="always">
                  <SelectItem value={"COMMON"} key={`select-dbImage-empty`}>
                    <div className="flex items-center gap-1">Common</div>
                  </SelectItem>
                  <SelectItem
                    value={"PROD_FEATURED"}
                    key={`select-dbImage-empty`}
                  >
                    <div className="flex items-center gap-1">Featured</div>
                  </SelectItem>
                  <SelectItem
                    value={"PROD_THUMBNAIL"}
                    key={`select-dbImage-empty`}
                  >
                    <div className="flex items-center gap-1">Thumbnail</div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button className="mt-2 w-full" onClick={() => handleMutate()}>Submit</Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
