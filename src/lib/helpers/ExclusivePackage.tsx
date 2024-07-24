import { PackageSelect } from "@/db/data/dto/package";

export function isIdExclusive(Package: PackageSelect[], id: string | null) {
  if (!id) return null;
  // if(!Package.length)
  const ExclusivePackage = Package.find(
    (item) => item.packageCategory === "EXCLUSIVE"
  );

  if (ExclusivePackage?.id === id) {
    return true;
  }

  return false;
}
