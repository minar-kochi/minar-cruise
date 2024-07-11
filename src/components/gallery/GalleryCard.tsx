import Image from "next/image";
import { familyGathering, celebrationGathering, corporateGathering } from "@/constants/gallery/gallery";
import Bounded from "../elements/Bounded";
import { getGallery } from "@/constants/gallery/getGalleryData";
import { TGalleries } from "@/Types/type";



const GalleryCard = ({ slug }:{
  slug: TGalleries
}) => {
  const { bannerImages, Text, allImages} = getGallery(slug)  

  return (
    <div>
      <div className="relative">
        <Image
          src={bannerImages[0].url} 
          alt={bannerImages[0].alt}
          width={1920}
          height={1080}
          className="  max-h-[400px] object-cover object-top"
        />
        <div className="absolute text-white   top-0 w-full h-full grid place-content-center text-center gap-3">
          <h3 className="text-5xl font-bold">{Text.bannerHeading}</h3>
          <p className="text-xl font-medium">{Text.bannerQuote}</p>
        </div>
      </div>

      <Bounded className="">
        <p className="text-slate-500   mx-auto md:px-28 my-16 font- tracking-wide">
          {Text.description}
        </p>
        <article className=" flex flex-wrap  items-center gap-9 justify-center mb-20">
          {allImages.map(({url}, i) => (
            <>
              <div className="" key={url+i}>
                <Image
                  src={url}
                  alt="gallery image"
                  width={1000}
                  height={400}
                  className="hover:border-8 border-primary md:hover:scale-110 hover:scale-110 duration-300 rounded-xl  object-cover max-w-[250px] aspect-square"
                  />
              </div>
            </>
          ))}
        </article>
      </Bounded>
    </div>
  );
};

export default GalleryCard;
