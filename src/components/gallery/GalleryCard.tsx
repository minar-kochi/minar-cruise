import { getGallery } from "@/constants/gallery/getGalleryData";
import { TGalleries } from "@/Types/type";
import Image from "next/image";
import Bounded from "../elements/Bounded";

const GalleryCard = ({ slug }: { slug: TGalleries }) => {
  const { bannerImages, Text, allImages } = getGallery(slug);

  return (
    <div>
      <div className="relative max-h-[400px] h-full overflow-hidden">
        <Image
          src={bannerImages[0].url}
          alt={bannerImages[0].alt}
          width={1920}
          height={1080}
          className="object-cover max-h-[400px]   aspect-video  h-full"
        />
        <div className="absolute text-white   top-0 w-full h-full grid place-content-center text-center gap-3">
          <h3 className="text-4xl md:text-5xl font-bold z-10">
            {Text.bannerHeading}
          </h3>
          <p className="text-xl font-medium z-10">{Text.bannerQuote}</p>
          <div className="absolute h-full w-full  bg-gradient-to-b from-black/70 via-black/40 to-slate-50/5" />
        </div>
      </div>

      <Bounded className="relative pb-12">
        <p className="text-slate-500 mx-auto md:px-28 my-16 tracking-wide text-center">
          {Text.description}
        </p>
        <div className="relative overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 md:px-16">
            {allImages.map(({ url }, i) => (
              <div
                key={`${url}-${i}-${slug}`}
                className="group relative overflow-hidden rounded-xl"
              >
                <Image
                  src={url}
                  alt="gallery image"
                  width={420}
                  height={720}
                  priority
                  className="object-contain w-full h-full rounded-xl transition-transform duration-500 group-hover:scale-150"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
              </div>
            ))}
          </div>
        </div>
      </Bounded>
    </div>
  );
};

export default GalleryCard;
