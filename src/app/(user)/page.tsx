import BookingDescription from "@/components/home/BookingDescription";
import ExclusivePackage from "@/components/home/ExclusivePackage";
import Facilities from "@/components/home/Facilities";
import GalleryCarousel from "@/components/home/GalleryCarousel";
import HomeVideo from "@/components/home/HomeVideo";
import MinarSec from "@/components/home/MinarSec";
import PackagesBento from "@/components/home/PackagesBento";
import Services from "@/components/home/Services";

export default function page() {
  return (
    <main className="embla__viewport">
      <HomeVideo />
      <MinarSec />
      <PackagesBento />
      <ExclusivePackage />
      <Services />
      <BookingDescription />
      <Facilities />
      <GalleryCarousel />
    </main>
  );
}
