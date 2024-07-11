import Link from "next/link";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  return (
    <div>
      <h1 className="font-bold text-2xl text-center border py-4">Schedule</h1>
        <Calendar className="border w-fit" />
    </div>
  );
}

{
  /* <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[240px] pl-3 text-left font-normal")}
          >
            {<span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="">
        </PopoverContent>
      </Popover> */
}
