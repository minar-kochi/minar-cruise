import HeroCard from "@/components/package/HeroCard";
import PackageDescriptionCard from "@/components/package/PackageDescriptionCard";
import TermsAndConditionsCard from "@/components/packages/TermsAndConditionsCard";
import { db } from "@/db";
import { getPackageDetails } from "@/db/data/dto/package";

interface IBookPage {
  params: {
    slug: string;
  };
}

export default async function page({ params: { slug } }: IBookPage) {
  const data = await getPackageDetails(slug);
  if (!data) return null;

  return (
    <main className="min-h-[calc(100vh-60px)] py-2 md:py-10 md:px-10 flex flex-col gap-8">
      <HeroCard
        adultPrice={data.adultPrice}
        childPrice={data.childPrice}
        id={data.id}
        packageCategory={data.packageCategory}
        title={data.title}
      />
      <PackageDescriptionCard
        amenities={data.amenities}
        description={data.description}
      />
      <TermsAndConditionsCard />
    </main>
  );
}
