import Image from "next/image";
import { entertainment } from "@/constants/home/landingData";
import { Bad_Script } from 'next/font/google'
import { cn } from "@/lib/utils";
import { Disc2 } from "lucide-react";

const badScript = Bad_Script({
    weight: "400",
    style: ["normal"],
    subsets: ["latin"]
}) 
const Entertainments = () => {
  const { image, activities } = entertainment;
  return (
    <section className="flex ">
      <article className="max-sm:hidden basis-[50%] object-bottom">
        <Image src={image.url} alt="" width={1920} height={1080} className="min-w-full min-h-full object-cover" />
      </article>
      <article className="flex justify-center md:justify-start items-center py-4 md:pl-20 max-sm:basis-full basis-[50%] w-full bg-red-700 text-white">
        <div className="max-w-fit space-y-10 my-3 ">
            <h1 className="text-5xl max-md:text-2xl font-bold  ">Entertainments</h1>
            <ul className={cn("text-2xl max-md:text-xl space-y-7 ", badScript.className)}>
                {activities.map((item)=>{
                  return <>
                    <li className="flex font-medium gap-4 ">
                      <item.icon width={64}/>
                      {item.description}
                    </li>
                  </>
                })}
            </ul>
        </div>
      </article>
    </section>
  );
};

export default Entertainments;
