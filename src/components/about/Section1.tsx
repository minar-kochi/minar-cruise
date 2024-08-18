import { Bad_Script, Poppins } from "next/font/google";
import Image from "next/image";
import Bounded from "../elements/Bounded";
import { images, about } from "@/constants/about/about";
import { cn } from "@/lib/utils";

const badScript = Bad_Script({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin", "cyrillic"],
});

const pop = Poppins({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
});

const Section1 = () => {
  return (
    <article className=" flex max-lg:flex-col max-lg:gap-10 mb-20 ">
      <div className="basis-[50%]  ">
        <Image
          src={images.cruiseTopView.url}
          alt={images.cruiseTopView.alt}
          width={1920}
          height={1080}
          className="rounded-lg lg:w-[450px]"
        />
      </div>
      <div className="basis-[50%] my-auto  flex flex-col gap-3">
        <h3 className={cn(" text-primary text-3xl", badScript.className)}>
          {about.title}
        </h3>
        <h2 className="font-semibold text-2xl ">{about.heading}</h2>
        <div
          className={cn(
            "space-y-8 text-justify  tracking-widest  text-sm text-slate-600",
            pop.className,
          )}
        >
          {about.description.map((item, i) => {
            return (
              <>
                <p className="leading-7 " key={item + i}>
                  {item}
                </p>
              </>
            );
          })}
        </div>
      </div>
    </article>
  );
};

export default Section1;
