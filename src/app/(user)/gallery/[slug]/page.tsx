import { getSectionVisibility } from "@/lib/helpers/config/getSectionVisibility";
import { notFound } from "next/navigation";
import { Galleries, TGalleries } from "@/Types/type";
import GalleryCard from "@/components/gallery/GalleryCard";
import { redirect } from "next/navigation";

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
const page = async ({ params }: GalleryProps) => {
  // Hidden pages must 404, not just lose their nav link.
  const visible = await getSectionVisibility();
  if (!visible["page.gallery"]) notFound();

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
