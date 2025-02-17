import { getPackageCardDetails } from "@/db/data/dto/package";
import PackageCarousel from "./PackageCarousel";

export default async function PackageCarousalWrapper() {
  const data = await getPackageCardDetails();

  if (!data) {
    console.error("Could not receive package data");
    return <></>;
  }

  return <PackageCarousel data={data} />;
}
