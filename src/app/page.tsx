import LandingDescription from "@/components/home/LandingDescription";
import BookingDescription from "@/components/home/BookingDescription";
import Facilities from "@/components/home/Facilities";
import Entertainments from "@/components/home/Entertainments";
import Services from "@/components/home/Services";
import HomePageGallery from "@/components/home/HomePageGallery";


export default function Home() {
  return (
    <main className="">
      {/* <HomeVideo/> */}
      <LandingDescription/>
      <BookingDescription/>
      <Facilities/>
      <Entertainments/>
      <Services/>
      <HomePageGallery/>
    </main>
  );
}
