import ContentCard from "@/components/packages/ContentCard";
import HeadingCard from "@/components/packages/HeadingCard";
import Reviews from "@/components/packages/Reviews";
import SuggestionCard from "@/components/packages/SuggestionCard";
import TermsAndConditionsCard from "@/components/packages/TermsAndConditionsCard";
import { db } from "@/db";
import { notFound } from "next/navigation";
import PackageGalleryCard from "@/components/packages/PackageGalleryCard";
import { getPackageById } from "@/db/data/dto/package";

interface BookingPage {
  params: {
    packageId: string;
  };
}

export default async function PackagePage({
  params: { packageId },
}: BookingPage) {
  const data = await getPackageById({ id: packageId });
  console.log("-----",data)

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

// data: {
//   id: string;
//   title: string;
//   description: string;
//   adultPrice: number;
//   packageImage: {
//       image: {
//           id: string;
//           alt: string;
//           packageImage: {
//               id: string;
//               packageId: string;
//               imageId: string;
//           }[];
//           url: string;
//       };
//   }[];
// } | null
