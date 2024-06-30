import Bounded from "@/components/elements/Bounded";
import Footer from "@/components/home/Footer";
import ContentCard from "@/components/packages/ContentCard";
import GalleryCard from "@/components/packages/GalleryCard";
import HeadingCard from "@/components/packages/HeadingCard";
import Reviews from "@/components/packages/Reviews";
import SuggestionCard from "@/components/packages/SuggestionCard";
import TermsAndConditionsCard from "@/components/packages/TermsAndConditionsCard";
import { db } from "@/db";
import { notFound } from "next/navigation";

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
      <GalleryCard packageId={data.id}/>
      <HeadingCard {...data} />
      <ContentCard {...data} />
      <SuggestionCard/>
      <TermsAndConditionsCard/>
      <Reviews/>
      <Footer/>
    </main>
  );
}
