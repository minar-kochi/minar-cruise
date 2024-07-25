import { getPackageSearchItems } from "@/db/data/dto/package";
import SearchBar from "./SearchBar";
import { cn, isProd } from "@/lib/utils";

export default async function SearchBarWrapper({ className }:{ className?: string}) {
  const packages = await getPackageSearchItems();
  if (!packages) {
    if (isProd) {
      return <></>;
    }
    return <>PACKAGE FETCHING FAILED, CHECK: SearchBar.tsx</>;
  }
  return (
    <div className={cn("", className)}>
      <SearchBar packages={packages} />;
    </div>
  );
}
