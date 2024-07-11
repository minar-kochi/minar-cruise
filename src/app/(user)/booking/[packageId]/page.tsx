import ContentCard from "@/components/packages/ContentCard";
import HeadingCard from "@/components/packages/HeadingCard";
import Reviews from "@/components/packages/Reviews";
import SuggestionCard from "@/components/packages/SuggestionCard";
import TermsAndConditionsCard from "@/components/packages/TermsAndConditionsCard";
import { db } from "@/db";
import { notFound } from "next/navigation";
import PackageGalleryCard from "@/components/packages/PackageGalleryCard";
import { getPackageById, TGetPackageById } from "@/db/data/dto/package";

interface BookingPage {
  params: {
    packageId: string;
  };
}

export default async function PackagePage({
  params: { packageId },
}: BookingPage) {
  const data = await getPackageById({ id: packageId });

  return (
    <main>
      <PackageGalleryCard data={data} />
      {/* <HeadingCard {...data} /> */}
      {/* <ContentCard {...data} /> */}
      <SuggestionCard />
      <TermsAndConditionsCard />
      <Reviews />
    </main>
  );
}
