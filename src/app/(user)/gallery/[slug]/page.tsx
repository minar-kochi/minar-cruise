import { Galleries, TGalleries, TGallery } from "@/Types/type";
import GalleryCard from "@/components/gallery/GalleryCard";
import { notFound, redirect } from "next/navigation";

interface GalleryProps {
  params: {
    slug: TGalleries;
  };
}

const page = ({ params }: GalleryProps) => {
  if (!Galleries.includes(params.slug)) {
    return redirect("/gallery/family-gathering");
  }
  return (
    <main>
      <GalleryCard slug={params.slug} />
    </main>
  );
};

export default page;
