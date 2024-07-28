import ContentCard from "@/components/packages/ContentCard";
import HeadingCard from "@/components/packages/HeadingCard";
import Reviews from "@/components/packages/Reviews";
import TermsAndConditionsCard from "@/components/packages/TermsAndConditionsCard";
import PackageGalleryCard from "@/components/packages/PackageGalleryCard";
import { getPackageById } from "@/db/data/dto/package";
import { isProd } from "@/lib/utils";

interface BookingPage {
  params: {
    packageId: string;
  };
}

export default async function PackagePage({
  params: { packageId },
}: BookingPage) {
  const data = await getPackageById({ id: packageId });
  if (!data) {
    if (isProd) {
      return;
    }
    return <>Failed to fetch package details</>;
  }

  
  return (
    <main>
      <PackageGalleryCard ImageData={data.packageImage} />
      <HeadingCard
        duration={data.duration}
        adultPrice={data.adultPrice}
        childPrice={data.childPrice}
        title={data.title}
      />
      <ContentCard
        amenitiesId={data.amenitiesId}
        description={data.description}
      />
      <TermsAndConditionsCard />
      <Reviews />
    </main>
  );
}

// {
//   id: string;
//   title: string;
//   description: string;
//   adultPrice: number;
//   amenitiesId: string;
//   packageImage: {
//     image: {
//       id: string;
//       packageImage: {
//         id: string;
//         packageId: string;
//         imageId: string;
//       }
//       [];
//       url: string;
//       alt: string;
//     }
//   }
//   [];
// }

// {
//   id: string;
//   title: string;
//   packageType: string;
//   description: string;
//   childPrice: number;
//   adultPrice: number;
//   amenitiesId: string;
//   duration: number;
//   slug: string;
//   foodMenuId: string;
//   startFrom: Date;
//   endAt: Date;
//   createdAt: Date;
//   packageCategory: PACKAGE_CATEGORY;
// }
