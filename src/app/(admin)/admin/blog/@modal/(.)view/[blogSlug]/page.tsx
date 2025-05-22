import { Modal } from "@/app/(admin)/admin/booking/@modal/(.)change/[bookingId]/modal";
import DisplayBlog from "@/components/admin/blog/DisplayBlog";
import { Dialog, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { getBlogDetailsFromSlug } from "@/db/data/dto/blog";

export default async function page({
  params,
}: {
  params: { blogSlug: string };
}) {
  const data = await getBlogDetailsFromSlug({ blogSlug: params.blogSlug });
  if (!data) return;
  return (
    <Modal className="max-h-[600px] scroll-hidden scrollbar-w-4 scrollbar-track-orange-lighter bg-white max-w-[900px] overflow-scroll overflow-x-hidden ">
      <DialogClose>
        <DisplayBlog
          author={data.author}
          title={data.title}
          selectedImg={data.image.url}
          content={data.content}
        />{" "}
      </DialogClose>
    </Modal>
  );
}
