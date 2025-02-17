import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface ICalendarPopover {
  children: React.ReactNode;
  date?: Date | undefined;
}
export default function CalendarPopover({ children, date }: ICalendarPopover) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "justify-start text-left font-normal max-w-[350px] w-full border border-muted shadow-md",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {/* <CalendarRange className="mr-2 h-4 w-4" /> */}
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="w-full max-w-max border border-muted shadow-lg mt-2"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
