"use client";

import { ForwardRefEditor } from "@/components/admin/blog/ForwardRefEditor";
import Markdown from "react-markdown";
import Bounded from "@/components/elements/Bounded";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  BlogFormValidators,
  TBlogFormValidators,
} from "@/lib/validators/BlogFormValidators";
import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { Loader2, Trash } from "lucide-react";
import { Suspense, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ChooseImg from "@/components/admin/blog/ChooseImg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { getBlogPostById } from "@/db/data/dto/blog";
import { DialogClose } from "@radix-ui/react-dialog";
import FacilitiesImageCard from "@/components/facilities/FacilitiesImageCard";
import DisplayBlog from "@/components/admin/blog/DisplayBlog";

export default function AddBlog() {
  const router = useRouter();
  const EditorRef = useRef<MDXEditorMethods | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string>("");
  // console.log(selectedImageId);

  const { mutate: addBlog } = trpc.admin.blog.addBlog.useMutation({
    onMutate() {
      toast.loading("Adding Blog Post");
    },
    onError(error) {
      toast.dismiss();
      toast.error(error.message);
    },
    onSuccess() {
      toast.dismiss();
      toast.success("Blog Added Successfully!");
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    watch,
    reset,
  } = useForm<TBlogFormValidators>({
    resolver: zodResolver(BlogFormValidators),
  });

  const onSubmitBlog = (data: TBlogFormValidators) => {
    addBlog(data);
  };
  watch();
  const title = getValues("title");
  const author = getValues("author");
  const content = getValues("content");
  return (
    <div className="border-2">
      <Dialog>
        <DialogTrigger className="sticky top-[90%] left-full mr-10   z-30 bg-green-700 px-4 py-2 rounded-3xl hover:bg-green-600">
          See blog
        </DialogTrigger>
        <DialogContent className="max-h-[600px] scroll-hidden scrollbar-w-4 scrollbar-track-orange-lighter bg-white max-w-[900px] overflow-scroll overflow-x-hidden ">
          <DialogClose>
            <DisplayBlog
              author={author}
              title={title}
              selectedImg={selectedImageId}
              content={content}
            />
          </DialogClose>
        </DialogContent>
      </Dialog>

      <h2 className="text-2xl font-semibold text-center">Create Your Blog!</h2>

      <form onSubmit={handleSubmit(onSubmitBlog)}>
        <div className="flex my-12 flex-col  gap-2 flex-wrap  items-center justify-center  "></div>
        <div className="flex gap-2 mx-auto flex-col  max-w-2xl flex-wrap items-center justify-center p-1.5">
          <div className="w-full flex gap-2">
            <Label className="w-full indent-1">
              Author Name
              <Input className="mt-1.5" {...register("author")} />
              <p className="min-h-4 indent-1 text-red-500 my-1.5">
                {errors.author ? errors.author.message : ""}
              </p>
            </Label>
          </div>
          <div className="w-full flex gap-2">
            <Label className="w-full indent-1">
              Title
              <Input className="mt-1.5" {...register("title")} />
              <p className="min-h-4 indent-1 text-red-500 my-1.5">
                {errors.title ? errors.title.message : ""}
              </p>
              <p
                className={cn("text-sm text-muted-foreground my-1.5", {
                  "text-red-500": errors?.title?.message,
                })}
              ></p>
            </Label>
          </div>
          <div className="w-full flex gap-2">
            <Label className="w-full indent-1  ">
              Slug
              <Input className="mt-1.5" {...register("blogSlug", {})} />
              <p
                className={cn("text-sm text-muted-foreground my-1.5", {
                  "text-red-500": errors?.blogSlug?.message,
                })}
              >
                Example: your-example-title-that-is-unique
              </p>
              <p className="h-4 indent-1 text-red-500 my-1.5 ">
                {errors.blogSlug ? errors.blogSlug.message : ""}
              </p>
            </Label>
          </div>
          <div className="w-full flex gap-2">
            <Label className="w-full indent-1">
              Short Description
              <Textarea
                className="mt-1.5 resize-none"
                // minRows={3}
                // maxRows={10}
                {...register("shortDes")}
              />
              <p className="min-h-4 indent-1 text-red-500 my-1">
                {errors.shortDes ? errors.shortDes.message : ""}
              </p>
              <p
                className={cn("text-sm text-muted-foreground my-1.5", {
                  "text-red-500": errors?.shortDes?.message,
                })}
              >
                Note: Add period in the end.
              </p>
            </Label>
          </div>
          <div className="w-full ">
            <Dialog>
              <DialogTrigger className="border-2  rounded-md p-2">
                Choose Image
              </DialogTrigger>
              <DialogContent className="max-h-[600px] max-w-[1000px] overflow-scroll overflow-x-hidden ">
                <DialogClose>
                  <Suspense fallback={<p>Loading Images..</p>}>
                    <ChooseImg
                      onSelectImage={(imageId: string, url: string) => {
                        setValue("imageId", imageId);
                        setSelectedImageId(url);
                      }}
                    />
                  </Suspense>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="max-w-screen-xl focus-within:bg-black/80 mx-auto border-[1px] border-t-0 rounded-xl mb-4 p-1.5 overflow-hidden ">
          <Suspense fallback={<p>Loading editor</p>}>
            <ForwardRefEditor
              ref={EditorRef}
              onChange={(e) => {
                setValue("content", e);
              }}
              autoFocus={{
                defaultSelection: "rootEnd",
              }}
              placeholder={<p>Write your Beautiful content here</p>}
              markdown={``}
            />
            <div className="">
              <p className="min-h-4 font-medium text-center indent-1 text-red-500 my-1">
                {errors.content ? errors.content.message : ""}
              </p>
            </div>
          </Suspense>
        </div>
        <Bounded className="justify-center items-center flex gap-2 flex-col mb-12">
          <div className="flex flex-col justify-center items-center gap-2 mb-12">
            <Select
              onValueChange={(value: "DRAFT" | "PUBLISHED") => {
                setValue("blogStatus", value);
              }}
            >
              <SelectTrigger className="w-[180px] flex items-center justify-between ">
                <SelectValue placeholder="Save or Publish" />
              </SelectTrigger>
              <SelectContent className="flex">
                <SelectItem value="PUBLISHED">Publish</SelectItem>
                <SelectItem value="DRAFT">Save</SelectItem>
              </SelectContent>
            </Select>
            <p className="min-h-4 font-medium text-center indent-1 text-red-500 my-1">
              {errors.blogStatus
                ? "Please Select One of the following above."
                : ""}
            </p>
          </div>

          <p className="text-center text-muted-foreground">
            Confirm this Content before submitting and validate your content is
            fully displayed
          </p>
          <Button
            className="max-w-xs w-full"
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </Bounded>
      </form>
    </div>
  );
}
