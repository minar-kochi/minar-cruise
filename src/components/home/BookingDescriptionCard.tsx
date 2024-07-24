import { Button } from "../ui/button";
import { BookingData } from "@/constants/home/landingData";
import { cn } from "@/lib/utils";
import { Bad_Script, Noto_Sans, Outfit } from "next/font/google";
import { BookingDescriptionItems } from "./BookingDescriptionItems";

const badScript = Bad_Script({
  weight: "400",
  style: ["normal"],
  subsets: ["latin"],
});

const out = Outfit({
  weight: ["800"],
  style: "normal",
  subsets: ["latin"],

})

const BookingDescriptionCard = () => {
  const { mainHeading, subHeading } = BookingData;
  return (
    <section className="flex justify-center items-center text-white absolute top-0 left-[45%] bg-black/60 max-w-[60vh] h-full z-20 max-md:left-0 max-md:max-w-full px-8 max-md:px-2">
      <div className="flex flex-col justify-evenly h-full">
        <article className="">
          <h2 className={cn("text-2xl", badScript.className)}>
            Our benefits list
          </h2>
          <h1 className={cn("text-4xl text-primary", out.className)}>{mainHeading}</h1>
          <p>{subHeading}</p>
        </article>
        <BookingDescriptionItems/>
        <Button className="w-full bg-primary hover:bg-white hover:text-primary tracking-widest font-semibold">BOOK NOW</Button>
      </div>
    </section>
  );
};

export default BookingDescriptionCard;

