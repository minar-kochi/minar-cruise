import Image from "next/image";
import { Button } from "@/components/ui/button"
import HomeVideo from "@/components/home/HomeVideo";
import LandingDescription from "@/components/home/LandingDescription";
import BookingDescription from "@/components/home/BookingDescription";


export default function Home() {
  return (
    <main className="">
      <HomeVideo/>
      <LandingDescription/>
      {/* <BookingDescription/> */}
    </main>
  );
}
