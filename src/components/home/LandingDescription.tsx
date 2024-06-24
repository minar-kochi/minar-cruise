import Bounded from "../elements/Bounded";
import Image from "next/image";
import { landingData } from "@/constants/home/landingData";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
// TODO: Home-> Landing page Image shitty Round animated circles.

const mont = Montserrat({
  weight: ["400", "700"],
  style: "normal",
  subsets: ["cyrillic"],
});

const LandingDescription = () => {
  const { description, heading, image, title } = landingData;

  return (
    <Bounded className="lg:max-w-6xl py-12 w-full md:place-items-center  md:grid lg:grid-cols-2 ">
      <section className="lg:max-w-lg flex flex-col gap-7 w-full   ">
        <p className="text-sm text-red-500 font-semibold">{heading}</p>
        <h1
          className={cn(
            "border-l-4 border-l-red-500 pl-2 text-4xl font-[Montserrat,sans-serif] font-bold ",
            mont.className
          )}
        >
          {title}
        </h1>
        <p className="font-sans tracking-wide leading-7">{description}</p>
        <Button>Read Me</Button>
      </section>
      <section className="mt-12 lg:mt-0">
        <div className="overflow-hidden rounded-full flex items-center justify-center">
          <Image
            width={500}
            height={500}
            src={image.url}
            style={{ width: "auto", height: "auto" }}
            className="overflow-hidden rounded-full"
            alt={image.url}
          />
        </div>
      </section>
    </Bounded>
  );
};

export default LandingDescription;
