import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import SetCalender from "./SetCalender";
import { getPackageNavigation } from "@/db/data/dto/package";

const SearchBar = async () => {
  const packages = await getPackageNavigation()
  return (
    <div className=" bg-white flex justify-center">
      <section className="shadow-xl m-3  w-[900px] min-h-[70px] rounded-full  flex justify- border items-center">
        <Popover>
          <PopoverTrigger className="hover:bg-neutral-200 w-full h-full rounded-full font-semibold hover:text-primary">
            Which
          </PopoverTrigger>
          <PopoverContent className="w-[500px] h-[500px]">
            <div className="border flex flex-wrap">{packages?.map((item,i) => {
              return <>
              <div className="w-44 border overflow-hidden" key={item.id+i}>{item.title}</div>
              </>
            })}</div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger className="hover:bg-neutral-200 w-full h-full rounded-full font-semibold hover:text-primary">
            when
          </PopoverTrigger>
          <PopoverContent>
            <SetCalender />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger className="hover:bg-neutral-200 w-full h-full rounded-full font-semibold hover:text-primary">
            Open
          </PopoverTrigger>
          <PopoverContent>Place content for the popover here.</PopoverContent>
        </Popover>
      </section>
    </div>
  );
};

export default SearchBar;
