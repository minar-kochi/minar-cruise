import Image from "next/image";
import { gallery } from "@/constants/gallery/gallery";
import { cn } from "@/lib/utils";


const GalleryCard = ({ className }:{
    className?:string;
}) => {
  return (
    <div className={cn("flex p-2 gap-2", className)}>
      {gallery.map((item, i) => (
        <>
          <article className="">
            <Image src={item} alt="" width={1920} height={1080} className=""/>
          </article>
        </>
      ))}
    </div>
  );
};

export default GalleryCard;
