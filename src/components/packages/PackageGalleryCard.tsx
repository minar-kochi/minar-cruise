import Image from "next/image";
import { cn } from "@/lib/utils";
import { getPackageImages } from "@/db/data/dto/Images";

const PackageGalleryCard = async ({
  className,
  data,
}: {
  className?: string;
  data: {
    id: string;
    title: string;
    description: string;
    adultPrice: number;
    packageImage: {
      image: {
        id: string;
        alt: string;
        packageImage: {
          id: string;
          packageId: string;
          imageId: string;
        }[];
        url: string;
      };
    }[];
  } | null;
}) => {
  // const images = await getImagesIdFromPackageId({ packageId })

  return (
    <div className={cn("flex p-2 gap-2  min-h-[400px]  ", className)}>
      <article className=" w-full">

        {data?.packageImage.map((item, i) => (
        <div className="w-[400px] h-full " key={item.image.id}>
          <Image
              priority={true}
              src={item.image.url}
              alt={item.image.alt}
              width={1920}
              height={1080}
              className="object-cover h-full"
            />
          </div>
        ))}
      </article>
    </div>
  );
};

export default PackageGalleryCard;
