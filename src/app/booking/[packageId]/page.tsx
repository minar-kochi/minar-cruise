import ContentCard from "@/components/packages/ContentCard";
import HeadingCard from "@/components/packages/HeadingCard";
import Reviews from "@/components/packages/Reviews";
import SuggestionCard from "@/components/packages/SuggestionCard";
import TermsAndConditionsCard from "@/components/packages/TermsAndConditionsCard";
import { db } from "@/db";
import { notFound } from "next/navigation";
import PackageGalleryCard from "@/components/packages/PackageGalleryCard";

interface BookingPage {
  params: {
    packageId: string;
  };
}

export default async function PackagePage({ params }: BookingPage) {
  const data = await db.package.findUnique({
    where: {
      slug: `${params.packageId}`,
    },
  });
  if(!data) notFound()
    
  return (
    <main>
      <PackageGalleryCard packageId={data.id}/>
      <HeadingCard {...data} />
      <ContentCard {...data} />
      <SuggestionCard/>
      <TermsAndConditionsCard/>
      <Reviews/>
    </main>
  );
}
