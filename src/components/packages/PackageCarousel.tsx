import { getPackageCardDetails } from "@/db/data/dto/package";
import { EmblaCarouselProvider } from "../Carousel/EmblaCarousel";
import PackageCard from "./PackageCard";
import Bounded from "../elements/Bounded";

export const PackageCarousel = async () => {
  const data = await getPackageCardDetails();
  if (!data) {
    console.log("could nt receive data");
    return null;
  }
  return (
    <Bounded className="flex flex-col items-center embla__viewport ">
      <div className="overflow-hidden">
        <EmblaCarouselProvider>
          {data.map((item, i) => {
            return (
              <PackageCard
                key={item.id}
                packageCategory={item.packageCategory}
                PackageId={item.id}
                slug={item.slug}
                amenities={item.amenities}
                className="embla__slide select-none first-of-type:ml-2"
                adultPrice={item.adultPrice}
                childPrice={item.childPrice}
                alt={item.packageImage[0]?.image.alt}
                title={item.title}
                url={item.packageImage[0]?.image.url}
              />
            );
          })}
        </EmblaCarouselProvider>
      </div>
    </Bounded>
  );
};
