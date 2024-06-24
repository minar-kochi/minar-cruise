import Image from "next/image";
import Bounded from "../elements/Bounded";
import { galleryImageUrl } from "@/constants/home/landingData";

const Gallery = () => {
  return (
    <section className="relative  h-full w-full flex justify-center items-center py-20 ">
      <Bounded className=" w-full space-y-20">
        <article className=" text-center space-y-5">
          <h5 className="text-red-500 font-bold text-4xl">GALLERY</h5>
          <h1 className="text-5xl font-bold">Explore Our Cruise</h1>
        </article>
        <article className=" flex flex-wrap md:justify-evenly items-center gap-10 justify-center ">
          {galleryImageUrl.map((url, i) => (
            <>
              <div className="" key={i}>
                <Image
                  src={url}
                  alt="gallery image"
                  width={1000}
                  height={400}
                  className="rounded-xl aspect-square md:max-w-64"
                  />
              </div>
            </>
          ))}
        </article>
      </Bounded>
      <Image
        className="absolute top-0 object-contain max-h-[100%] min-h-[100%] w-full  -z-30 "
        src={"/assets/world-map.png"}
        alt=""
        width={1920}
        height={1080}
      />
    </section>
  );
};

export default Gallery;
