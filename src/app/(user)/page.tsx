import LandingDescription from "@/components/home/LandingDescription";
import BookingDescription from "@/components/home/BookingDescription";
import Facilities from "@/components/home/Facilities";
import Entertainments from "@/components/home/Entertainments";
import Services from "@/components/home/Services";
import HomePageGallery from "@/components/home/HomePageGallery";
import SearchBar from "@/components/searchbar/SearchBar";
import HomeVideo from "@/components/home/HomeVideo";
import SearchBarWrapper from "@/components/searchbar/SearchBarWrapper";

export default function Home() {

  return (
    <main className="">
      <HomeVideo/>
      <LandingDescription />
      <BookingDescription />
      <Facilities />
      <Entertainments />
      <Services />
      <HomePageGallery />
    </main>
  );
}
