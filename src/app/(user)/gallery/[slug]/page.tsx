import { Galleries, TGalleries, TGallery } from "@/Types/type";
import GalleryCard from "@/components/gallery/GalleryCard";
import { notFound, redirect } from "next/navigation";

interface GalleryProps {
  params: {
    slug: TGalleries;
  };
}

export async function generateStaticParams({ params: { slug } }: GalleryProps) {
  return Galleries.map((item) => ({
    slug: item,
  }));
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
