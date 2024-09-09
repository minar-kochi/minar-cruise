import { cn } from "@/lib/utils";
import Image from "next/image";

interface IHeroImageCard {
  className?: string;
}

export default function HeroImageCard({ className }: IHeroImageCard) {
  return (
    <div className={cn("", className)}>
      <div className="pb-3 md:pb-5 ">
        <div className="">
          <h1 className="text-3xl font-bold  text-center md:text-start pt-5 md:pt-0">
            Breakfast Cruise
          </h1>
          <p className="hidden md:block text-primary ">
            (4:30 PM - 6:30 PM)
          </p>
        </div>
      </div>
      {/* <div className="py-5  md:px-0 md:py-0 md:p-0 bg-white  rounded-2xl md:rounded-none ">
        <Image
          src={"/assets/package/GroupImg.jpg"}
          alt="Breakfast Image"
          height={1920}
          width={1080}
          className="  md:max-h-[550px] md:w-[750px]"
        />
      </div> */}


  <div className="flex justify-between p-4 relative">
    <div className="basis-[40%]">
      <div className="flex flex-col justify-between items-end  h-full gap-4">
        <div className=" w-full">
          <Image
            alt=""
            src={"/assets/package/BreakFastDish.JPG"}
            width={1920}
            height={1080}
            className="w-full h-[300px] object-fill rounded-2xl"
          />
        </div>
        <div className=" -mr-28">
          <Image
            alt=""
            src={"/assets/package/Dish2.PNG"}
            width={1920}
            height={1080}
            className="w-[200px] rounded-2xl "
          />
        </div>
      </div>
    </div>
    <div className="basis-[40%]">
      <div className="flex flex-col   h-full gap-4">
        <div className="-ml-28">
          <Image
            alt=""
            src={"/assets/package/Dish1.PNG"}
            width={1920}
            height={1080}
            className="w-[200px] rounded-2xl"
          />
        </div>
        <Image
          alt=""
          src={"/assets/package/Breakfast1.JPG"}
          width={1920}
          height={1080}
          className=" rounded-2xl w-full h-[300px] object-cover"
        />
      </div>
    </div>
    <div className="absolute top-[25%] right-[30%] ">
      <Image
        alt=""
        src={"/assets/package/SunsetView.PNG"}
        width={1920}
        height={1080}
        className="w-[250px] h-[250px] object-cover rounded-full object-bottom border-[15px] border-white"
      />
    </div>
  </div>

    </div>
  );
}

