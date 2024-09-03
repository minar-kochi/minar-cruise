import LandingDescription from "@/components/home/LandingDescription";
import BookingDescription from "@/components/home/BookingDescription";
import Facilities from "@/components/home/Facilities";
import Entertainments from "@/components/home/Entertainments";
import Services from "@/components/home/Services";
import HomePageGallery from "@/components/home/HomePageGallery";
import HomeVideo from "@/components/home/HomeVideo";
import { PackageCarousel } from "@/components/packages/PackageCarousel";
import { constructMetadata } from "@/lib/helpers/constructMetadata";

export const metadata = constructMetadata({});
// console.log(metadata)
export default function Home() {
  return (
    <main className="embla__viewport">
      <HomeVideo />
      <LandingDescription />
      <PackageCarousel />
      <BookingDescription />
      <Facilities />
      <Entertainments />
      <Services />
      <HomePageGallery />
    </main>
  );
}
