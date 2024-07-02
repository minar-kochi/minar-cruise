import Image from "next/image";
import { cn } from "@/lib/utils";
import { getPackageImages } from "@/db/data/dto/Images";

const PackageGalleryCard = async ({
  className,
  packageId,
}: {
  className?: string;
  packageId: string;
}) => {
  const packageImages = await getPackageImages({ packageId });
  if (!packageImages) {
    // TODO: #LOW - Add a alternative to Image Gallery if not found / empty
    return (
      <>
      </>
    );
  }
  return (
    <div className={cn("flex p-2 gap-2", className)}>
      {packageImages.map((item, i) => (
        <article key={item.id} className="">
          <Image
            key={item.id}
            priority={true}
            src={item.url}
            alt={item.alt}
            width={1920}
            height={1080}
            className=""
          />
        </article>
      ))}
    </div>
  );
};

export default PackageGalleryCard;
