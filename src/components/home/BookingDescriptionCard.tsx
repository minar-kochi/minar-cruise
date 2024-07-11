import { Button } from "../ui/button";
import { BookingData } from "@/constants/home/landingData";
import { cn } from "@/lib/utils";
import { Bad_Script } from "next/font/google";

const badScript = Bad_Script({
  weight: "400",
  style: ["normal"],
  subsets: ["latin"],
});

const BookingDescriptionCard = () => {
  const { mainHeading, subHeading, features } = BookingData;
  return (
    <section className="flex justify-center items-center text-white absolute top-0 left-[45%] bg-black/60 max-w-[60vh] h-full z-20 max-md:left-0 max-md:max-w-full px-8 max-md:px-2">
      <div className="flex flex-col justify-evenly h-full">
        <article className="">
          <h2 className={cn("text-2xl", badScript.className)}>
            Our benefits list
          </h2>
          <h1 className="text-4xl font-bold">{mainHeading}</h1>
          <p>{subHeading}</p>
        </article>
        <article className="space-y-5">
          {features.map((item, i) => (
            <>
              <div className="md:space-y-2" key={item.heading+i}>
                <h2 className="text-2xl font-bold">{item.heading}</h2>
                <p className="">{item.description}</p>
              </div>
            </>
          ))}
        </article>
        <Button className="w-full">BOOK NOW</Button>
      </div>
    </section>
  );
};

export default BookingDescriptionCard;
