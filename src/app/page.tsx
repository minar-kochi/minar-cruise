import Image from "next/image";
import { Button } from "@/components/ui/button"
import HomeVideo from "@/components/home/HomeVideo";
import LandingDescription from "@/components/home/LandingDescription";
import BookingDescription from "@/components/home/BookingDescription";
import Facilities from "@/components/home/Facilities";
import Entertainments from "@/components/home/Entertainments";
import Services from "@/components/home/Services";
import Gallery from "@/components/home/Gallery";
import Footer from "@/components/home/Footer";


export default function Home() {
  return (
    <main className="">
      <HomeVideo/>
      <LandingDescription/>
      <BookingDescription/>
      <Facilities/>
      <Entertainments/>
      <Services/>
      <Gallery/>
      <Footer/>
    </main>
  );
}
