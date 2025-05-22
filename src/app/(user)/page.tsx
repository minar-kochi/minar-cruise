import BookingDescription from "@/components/home/BookingDescription";
import ExclusivePackage from "@/components/home/ExclusivePackage";
import Facilities from "@/components/home/Facilities";
import GalleryCarousel from "@/components/home/GalleryCarousel";
import HomeVideo from "@/components/home/HomeVideo";
import MinarSec from "@/components/home/MinarSec";
import PackagesBento from "@/components/home/PackagesBento";
import Services from "@/components/home/Services";
import SearchBarWrapper from "@/components/searchbar/SearchBarWrapper";
import { constructMetadata } from "@/lib/helpers/constructMetadata";

export const metadata = constructMetadata({});
// console.log(metadata)
export default function page() {
  return (
    <main className="embla__viewport relative ">
      <HomeVideo />
      <MinarSec />
      <PackagesBento />
      <ExclusivePackage />
      <Services />
      <Facilities />
      <BookingDescription />
      <GalleryCarousel />
      <SearchBarWrapper className="fixed bottom-0 w-full z-30" />
    </main>
  );
}
