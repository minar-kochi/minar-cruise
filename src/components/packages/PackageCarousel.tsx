import { getPackageCardDetails } from "@/db/data/dto/package";
import { EmblaCarouselProvider } from "../Carousel/EmblaCarousel";
import PackageCard from "./PackageCard";

export const PackageCarousel = async () => {
  const data = await getPackageCardDetails();
  if (!data) {
    console.log("could nt receive data");
    return null;
  }
  return (
    <section className="flex flex-col items-center py-20 ">
      <h6 className="text-sm tracking-widest text-primary font-medium">
        PACKAGES
      </h6>
      <h1 className="font-bold text-5xl pt-5">Most Popular Cruises</h1>
      <div className="overflow-hidden">
        <EmblaCarouselProvider>
          {data.map((item, i) => {
            return (
              <PackageCard
                key={item.id}
                className="embla__slide select-none first-of-type:ml-2"
                adultPrice={item.adultPrice}
                alt={item.packageImage[0].image.alt}
                duration={item.duration}
                title={item.title}
                url={item.packageImage[0].image.url}
              />
            );
          })}
        </EmblaCarouselProvider>
      </div>
    </section>
  );
};
