import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";

export default function SearchBarWrapper({
  className,
}: {
  className?: string;
}) {

  return (
    <div className={cn("", className)}>
      <SearchBar  />;
    </div>
  );
}
