import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import SetCalender from "./SetCalender";
import {
  getPackageNavigation,
  getPackageSearchItems,
} from "@/db/data/dto/package";
import Image from "next/image";
import { url } from "inspector";
import { Button } from "../ui/button";

const SearchBar = async () => {
  const packages = await getPackageSearchItems();

  if (!packages) {
    if (process.env.NODE_ENV === "production") {
      return <></>;
    }
    return <>PACKAGE FETCHING FAILED, CHECK: SearchBar.tsx</>;
  }
  const { title } = packages[0];
  const {} = packages.map((item) => {
    item.packageImage.map((c) => c.image);
  });
  return (
    <div className=" bg-white flex justify-center">
      <section className="shadow-xl outline-1 m-3  w-[900px] min-h-[70px] rounded-full  flex justify-  items-center tracking-wider">
        <Popover>
          <PopoverTrigger className="hover:bg-gray-300 w-full h-full rounded-full  font-semibold hover:text-primary">
            which
          </PopoverTrigger>
          <PopoverContent className="outline-none border-0 shadow-2xl mt-4 rounded-3xl w-[500px] bg-white">
            <div className="grid grid-cols-3 h-full gap-3">
              {packages.length > 0
                ? packages?.map((item, i) => {
                    return (
                      <div
                        className="hover:bg-primary hover:text-white font-bold p-2 rounded-lg w-full h-full flex flex-col gap-2 items-center text-center"
                        key={item.id + i}
                      >
                        <Image
                          src={item.packageImage[0].image.url}
                          alt={item.packageImage[0].image.alt}
                          height={1920}
                          width={1080}
                          className="shadow-2xl rounded-xl object-cover max-h-[100px] max-w"
                        />
                        <div className="">{item.title}</div>
                      </div>
                    );
                  })
                : null}
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger className="hover:bg-neutral-200 w-full h-full rounded-full font-semibold hover:text-primary">
            when
          </PopoverTrigger>
          <PopoverContent className="bg-white rounded-3xl border-0 mt-4">
            <SetCalender />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger  className="flex justify-evenly items-center   hover:bg-neutral-200 w-full h-full rounded-full font-semibold hover:text-primary">
            <div className=" ">Who</div>
            {/* FIX: not able to apply button inside Popover trigger component, it is causing hydration error */}
            {/* <Button className="rounded-full py-6 px-14">Search</Button> */}
          </PopoverTrigger>
          <PopoverContent className="outline-none border-0 shadow-2xl mt-4 rounded-3xl w-[500px] bg-white">
            <GuestLabel label="Adults" desc="Ages 13 or above" />
            <GuestLabel label="Children" desc="Ages 2–12" />
          </PopoverContent>
        </Popover>
      </section>
    </div>
  );
};

function GuestLabel({ label, desc }: { label: string; desc: string }) {
  return (
    <section className="border-b border-slate-300 mx-4 py-4">
      <article className="flex w-full">
        <div className="w-full space-y-1">
          <h4 className="font-semibold ">{label}</h4>
          <p className="text-muted-foreground text-sm">{desc}</p>
        </div>
        <div className="w-full flex justify-end items-center">number</div>
      </article>
    </section>
  );
}
export default SearchBar;
