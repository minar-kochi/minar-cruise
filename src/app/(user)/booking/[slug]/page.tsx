import ContentCard from "@/components/packages/ContentCard";
import HeadingCard from "@/components/packages/HeadingCard";
import Reviews from "@/components/packages/Reviews";
import TermsAndConditionsCard from "@/components/packages/TermsAndConditionsCard";
import PackageGalleryCard from "@/components/packages/PackageGalleryCard";
import { getPackageById } from "@/db/data/dto/package";
import { isProd } from "@/lib/utils";
import { db } from "@/db";
import { Metadata } from "next";

interface BookingPage {
  params: {
    slug: string;
  };
}

export async function generateStaticParams({ params: { slug } }: BookingPage) {
  const packageSlug = await db.package.findMany({
    select: {
      slug: true,
    },
  });

  return packageSlug.map((item) => ({
    slug: item.slug,
  }));
}
export default async function PackagePage({ params: { slug } }: BookingPage) {
  const data = await getPackageById({ slug });
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
        fromTime={data.fromTime}
        toTime={data.toTime}
      />
      <ContentCard
        amenitiesId={data.amenitiesId}
        description={data.description}
        formData={data} 
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
