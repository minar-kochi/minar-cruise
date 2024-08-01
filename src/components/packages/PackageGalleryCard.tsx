import Image from "next/image";
import { cn } from "@/lib/utils";
import { getPackageImages } from "@/db/data/dto/Images";
import { TGetPackageById } from "@/db/data/dto/package";
import { EmblaCarouselProvider } from "../Carousel/EmblaCarousel";

type TPackageGalleryCard = {
  className?: string;
  ImageData: {
    image: {
      id: string;
      packageImage: {
        id: string;
        packageId: string;
        imageId: string;
      }[];
      url: string;
      alt: string;
    };
  }[];
};

const PackageGalleryCard = async ({
  className,
  ImageData,
}: TPackageGalleryCard) => {
  return (
    <div
      className={cn("flex p-2 gap-2  min-h-[400px] overflow-hidden", className)}
    >
      <EmblaCarouselProvider>
        {ImageData?.map((item, i) => (
          <div
            className="embla__slide select-none first-of-type:ml-2 max-w-fit"
            key={item.image.id}
          >
            <Image
              priority={true}
              src={item.image.url}
              alt={item.image.alt}
              width={1920}
              height={1080}
              className=" w-[500px]"
            />
          </div>
        ))}
      </EmblaCarouselProvider>
    </div>
  );
};

export default PackageGalleryCard;
