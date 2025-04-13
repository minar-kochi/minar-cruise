"use client";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import { useClientSelector } from "@/hooks/clientStore/clientReducers";

export default function SearchBarWrapper({
  className,
}: {
  className?: string;
}) {
  const packages = useClientSelector((state) => state.package.packages);

  return (
    <div className={cn("", className)}>
      <SearchBar  />;
    </div>
  );
}
