import BookingDescription from "@/components/home/BookingDescription";
import ExclusivePackage from "@/components/home/ExclusivePackage";
import Facilities from "@/components/home/Facilities";
import GalleryCarousel from "@/components/home/GalleryCarousel";
import HomeVideo from "@/components/home/HomeVideo";
import MinarSec from "@/components/home/MinarSec";
import PackagesBento from "@/components/home/PackagesBento";
import Services from "@/components/home/Services";
import { constructMetadata } from "@/lib/helpers/constructMetadata";
import { Suspense } from "react";

export const metadata = constructMetadata({});
// console.log(metadata)
export default function page() {
  return (
    <main className="embla__viewport">
      <Suspense fallback={<>Loading....</>}>
        <HomeVideo />
      </Suspense>
      <MinarSec />
      <PackagesBento />
      <ExclusivePackage />
      <Services />
      <Facilities />
      <BookingDescription />
      <GalleryCarousel />
    </main>
  );
}
