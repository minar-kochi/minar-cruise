import { operation } from "@/constants/about/about";
import { cn } from "@/lib/utils";
import { Bad_Script, Poppins } from "next/font/google";
import { images } from "@/constants/about/about";
import Image from "next/image";

const pop = Poppins({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
});

const Section2 = () => {
  return (
    <article className=" flex max-lg:flex-col-reverse max-lg:gap-10 mb-20 ">
      <div className="basis-[50%]  space-y-5 flex flex-col gap-3  ">
        <h2 className="font-semibold text-4xl ">{operation.heading}</h2>
        <div
          className={cn(
            "text-justify  text-sm text-slate-600 tracking-widest",
            pop.className
          )}
        >
          <p className="leading-7">{operation.description}</p>
        </div>
      </div>
      <div className="basis-[50%]  flex justify-end">
        <Image
          src={images.fishnet.url}
          alt={images.fishnet.alt}
          width={1920}
          height={1080}
          className="rounded-lg lg:w-[450px]"
        />
      </div>
    </article>
  );
};

export default Section2;
