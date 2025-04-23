"use client";

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
import { Blog } from "@prisma/client";

interface IBlogFormProps {
  type: "CREATE" | "UPDATE";
  prefill?: Blog;
}

export default function BlogForm({ type, prefill }: IBlogFormProps) {
  const router = useRouter();
  const EditorRef = useRef<MDXEditorMethods | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string>("");

  const { mutate: updateBlog } = trpc.admin.blog.updateBlog.useMutation({
    onMutate() {
      toast.loading("Updating Blog Post");
    },
    onError(error) {
      toast.dismiss();
      toast.error(error.message);
    },
    onSuccess() {
      toast.dismiss();
      toast.success("Blog Added updated!");
      // Add redirect here
      reset();
    },
  });
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

  const { fetch } = trpc.useUtils().admin.blog.checkSlug;

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
    defaultValues: {
      author: prefill?.author,
      blogSlug: prefill?.blogSlug,
      blogStatus: prefill?.blogStatus,
      content: prefill?.content,
      imageId: prefill?.imageId,
      shortDes: prefill?.shortDes,
      title: prefill?.title,
    },
  });

  const onSubmitBlog = async (data: TBlogFormValidators) => {
    // UPDATE BLOG
    if (type === "UPDATE") {
      if (!prefill) {
        toast.error("Failed to update, Please try again");
        return;
      }
      updateBlog({ ...data, id: prefill.id });
      return;
    }

    // CREATE BLOG

    // Check if the slug already exists
    const slugExists = await fetch(data.blogSlug);

    if (slugExists) {
      toast.error("This slug is already taken. Please choose another one.");
      return;
    }

    addBlog(data);
  };

  watch();
  const title = getValues("title");
  const author = getValues("author");
  const content = getValues("content");

  return (
    <div className="">
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
        <Bounded className="  rounded-xl mb-4 p-1.5 overflow-hidden ">
          <Suspense fallback={<p>Loading editor</p>}>
            <ForwardRefEditor
              ref={EditorRef}
              contentEditableClassName=""
              onChange={(e) => {
                setValue("content", e);
              }}
              autoFocus={{
                defaultSelection: "rootEnd",
              }}
              placeholder={<p>Write your Beautiful content here</p>}
              markdown={content ?? ''}
              className=""
            />
            <div className="">
              <p className="min-h-4 font-medium text-center indent-1 text-red-500 my-1">
                {errors.content ? errors.content.message : ""}
              </p>
            </div>
          </Suspense>
        </Bounded>
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
            {type === "CREATE" ? "Create" : "Update"}
          </Button>
        </Bounded>
      </form>
    </div>
  );
}
